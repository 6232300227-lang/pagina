const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./db/connection');
const User = require('./models/User');
const CartItem = require('./models/Cart');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

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
