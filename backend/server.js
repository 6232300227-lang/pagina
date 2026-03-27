const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { connectDB } = require('./db/connection');
const User = require('./models/User');
const CartItem = require('./models/Cart');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

// Mercado Pago access token (used via direct HTTP request)
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-138373493028620-032618-5d962b9c5f5cec27ee7ec14701e75c89-2049134991';
const MP_API_URL = 'https://api.mercadopago.com/checkout/preferences';

connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en login' });
  }
});

// Simple users endpoint for admin/dev
app.get('/api/users', async (req, res) => {
  const users = await User.find().limit(50).select('-password');
  res.json(users);
});

// Create or ensure user (used by frontend checkout)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    let user = await User.findOne({ email });
    if (user) return res.status(200).json({ id: user._id, name: user.name, email: user.email });

    // Create a random password for users created via checkout
    const randomPass = Math.random().toString(36).slice(2, 10);
    const hashed = await bcrypt.hash(randomPass, 10);
    user = await User.create({ name, email, password: hashed });

    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Cart endpoints
app.get('/api/cart', async (req, res) => {
  const items = await CartItem.find().limit(200);
  res.json(items);
});

app.post('/api/cart', async (req, res) => {
  try {
    const item = await CartItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mercado Pago: create preference and return init_point
app.post('/api/payments/create_preference', async (req, res) => {
  try {
    const { items, payer, back_urls } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    const preference = {
      items: items.map(it => ({
        title: it.title || it.name || 'Producto',
        quantity: Number(it.quantity) || 1,
        unit_price: Number(it.unit_price || it.price || 0)
      })),
      payer: payer || {},
      back_urls: back_urls || {
        success: process.env.FRONTEND_URL || 'http://localhost:5500',
        failure: process.env.FRONTEND_URL || 'http://localhost:5500',
        pending: process.env.FRONTEND_URL || 'http://localhost:5500'
      },
      auto_return: 'approved'
    };

    // Use fetch to call Mercado Pago API directly
    if (typeof fetch === 'undefined') {
      throw new Error('Global fetch is not available in this Node runtime. Please run on Node 18+ or install a fetch polyfill.');
    }

    const response = await fetch(MP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference)
    });

    const mpJson = await response.json();
    if (response.ok) {
      return res.json({ init_point: mpJson.init_point, preferenceId: mpJson.id });
    }

    console.error('MP API responded with error:', mpJson);
    res.status(500).json({ error: 'No init_point returned', details: mpJson });
  } catch (err) {
    console.error('MP error:', err);
    res.status(500).json({ error: 'Error creating Mercado Pago preference' });
  }
});

function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use.`);
      if (attempt < 5) {
        const nextPort = port + 1;
        console.warn(`Trying port ${nextPort} (attempt ${attempt + 1})`);
        // give a short delay before retrying to avoid tight loop
        setTimeout(() => startServer(nextPort, attempt + 1), 250);
      } else {
        console.error(`Unable to bind to a port after ${attempt + 1} attempts. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
