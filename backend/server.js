require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://community-events1.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  if (req.path === '/api/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

console.log('=== Environment Check ===');
console.log('Stripe Key exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('Port:', process.env.PORT);
console.log('Client URL:', process.env.CLIENT_URL);
console.log('=======================');

app.get('/', (req, res) => {
  res.json({ 
    message: 'Events Platform API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      checkout: '/api/create-checkout-session (POST)',
      webhook: '/api/webhook (POST)'
    }
  });
});

app.get('/api/health', (req, res) => {
  console.log('📍 Health check requested');
  res.json({ 
    status: 'ok',
    stripe: !!process.env.STRIPE_SECRET_KEY,
  });
});

app.post('/api/create-checkout-session', async (req, res) => {
  console.log('\n🔵 Creating checkout session...');
  console.log('📊 Request body:', req.body);
  console.log('🔗 Client URL:', process.env.CLIENT_URL);
  
  try {
    const { eventId, eventName, price, userId, userEmail } = req.body;

    if (!eventId || !eventName || !price || !userId || !userEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields'
      });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: eventName,
              description: `Ticket for ${eventName}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&event_id=${eventId}`,
      cancel_url: `${process.env.CLIENT_URL}/events`,
      customer_email: userEmail,
      metadata: {
        eventId,
        userId,
      },
    });

    console.log('✅ Session created:', session.id);
    console.log('🔗 Success URL:', session.success_url);
    console.log('↩️ Cancel URL:', session.cancel_url);

    res.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      error: error.message
    });
  }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('⚠️ Webhook received but secret not set');
    return res.json({ received: true });
  }

  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      console.log('✅ Payment successful:', event.data.object.id);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`);
});