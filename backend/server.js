const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { connectDB } = require('./db/connection');
const User = require('./models/User');
const CartItem = require('./models/Cart');
const Order = require('./models/Order');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@stylehub.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador StyleHub';

// Mercado Pago access token (used via direct HTTP request)
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-138373493028620-032618-c24ebc952540422844b3ed964ec3eb52-2049134991';
const MP_API_URL = 'https://api.mercadopago.com/checkout/preferences';
const MP_PAYMENT_API_URL = 'https://api.mercadopago.com/v1/payments';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://stylehub.pics';
const BACKEND_PUBLIC_URL = process.env.BACKEND_PUBLIC_URL || 'https://pagina-6ygv.onrender.com';
const MP_NOTIFICATION_URL = process.env.MP_NOTIFICATION_URL || `${BACKEND_PUBLIC_URL}/api/payments/webhook`;

function normalizeFrontendBase(value) {
  if (!value) return '';

  try {
    const parsed = new URL(value);
    parsed.pathname = '/';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/$/, '');
  } catch (_err) {
    return String(value)
      .replace(/\/carrito\.html.*$/i, '')
      .replace(/\/$/, '');
  }
}

function mapMercadoPagoStatus(status = '') {
  switch (String(status).toLowerCase()) {
    case 'approved':
      return 'approved';
    case 'pending':
    case 'in_process':
    case 'in_mediation':
      return 'pending';
    case 'rejected':
      return 'rejected';
    case 'cancelled':
    case 'cancel':
      return 'cancelled';
    default:
      return 'pending_payment';
  }
}

function toMoney(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function buildOrderSummary(items = [], incomingSummary = {}) {
  const subtotal = items.reduce((acc, item) => {
    return acc + (toMoney(item.unit_price || item.price) * (Number(item.quantity) || 1));
  }, 0);

  const shipping = toMoney(incomingSummary.shipping);
  const discount = toMoney(incomingSummary.discount);
  const total = subtotal + shipping - discount;

  return { subtotal, shipping, discount, total };
}

async function fetchMercadoPagoPayment(paymentId) {
  const response = await fetch(`${MP_PAYMENT_API_URL}/${paymentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
    }
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(`Mercado Pago payment lookup failed: ${JSON.stringify(json)}`);
  }

  return json;
}

function extractWebhookPaymentId(req) {
  return String(
    req.body?.data?.id ||
    req.body?.id ||
    req.query['data.id'] ||
    req.query.id ||
    ''
  ).trim();
}

async function syncOrderFromMercadoPagoPayment(paymentId) {
  if (!paymentId) {
    return null;
  }

  const payment = await fetchMercadoPagoPayment(paymentId);
  const externalReference = payment.external_reference || payment.metadata?.order_reference || '';

  const update = {
    paymentId: String(payment.id || paymentId),
    paymentStatus: payment.status || 'unknown',
    paymentStatusDetail: payment.status_detail || '',
    status: mapMercadoPagoStatus(payment.status),
    rawPayment: payment,
    paidAt: payment.date_approved ? new Date(payment.date_approved) : null
  };

  const query = externalReference
    ? { externalReference }
    : { paymentId: String(payment.id || paymentId) };

  const order = await Order.findOneAndUpdate(query, { $set: update }, { new: true });
  return { order, payment };
}

connectDB()
  .then(() => ensureDefaultAdmin())
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

async function ensureDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'admin'
      });
      console.log(`Admin account created: ${ADMIN_EMAIL}`);
      console.log('Change ADMIN_PASSWORD in environment variables for production.');
      return;
    }

    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`User promoted to admin: ${ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('Failed to ensure default admin:', err);
  }
}

function parseBearerToken(authorizationHeader = '') {
  if (!authorizationHeader.startsWith('Bearer ')) return null;
  return authorizationHeader.slice(7).trim();
}

async function requireAdmin(req, res, next) {
  try {
    const token = parseBearerToken(req.headers.authorization || '');
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub).select('email role name');
    if (!user) return res.status(401).json({ error: 'Usuario no válido' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores' });

    req.authUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'customer' });

    const token = jwt.sign({ sub: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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

    if (!user.password) return res.status(401).json({ error: 'Esta cuenta usa inicio con Google' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ sub: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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
    user = await User.create({ name, email, password: hashed, role: 'customer' });

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
    const { items, payer, back_urls, shippingInfo, summary } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Mercado Pago no está configurado (falta MP_ACCESS_TOKEN)' });
    }

    const originFromRequest = (req.headers.origin || '').replace(/\/$/, '');
    const frontendBase = normalizeFrontendBase(FRONTEND_URL || originFromRequest || `http://localhost:${PORT}`);
    const orderReference = `SH-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const normalizedItems = items.map(it => ({
      title: it.title || it.name || 'Producto',
      quantity: Number(it.quantity) || 1,
      unit_price: toMoney(it.unit_price || it.price)
    }));
    const orderSummary = buildOrderSummary(normalizedItems, summary || {});

    const preference = {
      items: normalizedItems,
      payer: payer || {},
      back_urls: back_urls || {
        success: `${frontendBase}/carrito.html?mp_status=success`,
        failure: `${frontendBase}/carrito.html?mp_status=failure`,
        pending: `${frontendBase}/carrito.html?mp_status=pending`
      },
      auto_return: 'approved',
      external_reference: orderReference,
      statement_descriptor: 'STYLEHUB',
      metadata: {
        source: 'stylehub-web',
        order_reference: orderReference
      }
    };

    if (MP_NOTIFICATION_URL) {
      preference.notification_url = MP_NOTIFICATION_URL;
    }

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
      await Order.create({
        externalReference: orderReference,
        preferenceId: mpJson.id,
        paymentStatus: 'pending',
        status: 'pending_payment',
        payer: {
          name: payer?.name || shippingInfo?.fullName || '',
          email: payer?.email || shippingInfo?.email || ''
        },
        shippingInfo: {
          fullName: shippingInfo?.fullName || '',
          email: shippingInfo?.email || '',
          phone: shippingInfo?.phone || '',
          address: shippingInfo?.address || '',
          city: shippingInfo?.city || '',
          zipCode: shippingInfo?.zipCode || ''
        },
        items: normalizedItems.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.unit_price
        })),
        summary: orderSummary
      });

      return res.json({
        init_point: mpJson.init_point || mpJson.sandbox_init_point,
        preferenceId: mpJson.id,
        externalReference: orderReference
      });
    }

    console.error('MP API responded with error:', mpJson);
    res.status(500).json({ error: 'No init_point returned', details: mpJson });
  } catch (err) {
    console.error('MP error:', err);
    res.status(500).json({ error: 'Error creating Mercado Pago preference' });
  }
});

app.get('/api/payments/webhook', (req, res) => {
  res.status(200).json({ ok: true, message: 'Webhook Mercado Pago activo' });
});

app.post('/api/payments/webhook', async (req, res) => {
  try {
    const topic = String(req.query.topic || req.body?.type || '').toLowerCase();
    const paymentId = extractWebhookPaymentId(req);

    if (topic && topic !== 'payment') {
      return res.status(200).json({ ok: true, ignored: true, topic });
    }

    if (!paymentId) {
      return res.status(200).json({ ok: true, ignored: true, reason: 'payment id missing' });
    }

    const result = await syncOrderFromMercadoPagoPayment(paymentId);
    return res.status(200).json({
      ok: true,
      paymentId,
      status: result?.order?.status || result?.payment?.status || 'processed'
    });
  } catch (err) {
    console.error('Mercado Pago webhook error:', err);
    return res.status(500).json({ error: 'Error procesando webhook de Mercado Pago' });
  }
});

app.get('/api/payments/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId requerido' });
    }

    const result = await syncOrderFromMercadoPagoPayment(paymentId);
    if (!result?.payment) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    return res.json({
      paymentId: String(result.payment.id || paymentId),
      paymentStatus: result.payment.status || 'unknown',
      paymentStatusDetail: result.payment.status_detail || '',
      orderStatus: result.order?.status || 'pending_payment',
      externalReference: result.payment.external_reference || result.order?.externalReference || ''
    });
  } catch (err) {
    console.error('Mercado Pago status lookup error:', err);
    return res.status(500).json({ error: 'No se pudo consultar el estado del pago' });
  }
});

// Google OAuth Sign-In
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'Credential requerido' });

    // Verify Google ID token via Google's tokeninfo endpoint
    const tokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    const tokenInfo = await tokenRes.json();

    if (!tokenRes.ok || tokenInfo.error) {
      return res.status(401).json({ error: 'Token de Google inválido' });
    }

    const { email, name, sub: googleId, picture } = tokenInfo;
    if (!email) return res.status(400).json({ error: 'No se pudo obtener el email de Google' });

    // Find existing user or create a new one
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: name || email.split('@')[0], email, googleId, role: 'customer' });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ sub: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, picture } });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Error al autenticar con Google' });
  }
});

// Admin dashboard stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    const [totalUsers, totalAdmins, newUsersLast7d, cartItemsAgg] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      CartItem.aggregate([
        {
          $group: {
            _id: null,
            totalItems: { $sum: '$qty' },
            totalValue: { $sum: { $multiply: ['$qty', '$price'] } }
          }
        }
      ])
    ]);

    const totals = cartItemsAgg[0] || { totalItems: 0, totalValue: 0 };
    res.json({
      totalUsers,
      totalAdmins,
      newUsersLast7d,
      cart: {
        totalItems: totals.totalItems || 0,
        totalValue: Number(totals.totalValue || 0)
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'No se pudieron cargar estadísticas' });
  }
});

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select('name email role googleId createdAt');
    res.json(users);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'No se pudieron cargar usuarios' });
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
