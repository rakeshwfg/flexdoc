/**
 * Stripe Webhook Server for FlexDoc Pro
 *
 * This is a standalone Express server that handles Stripe webhooks
 * Can be deployed to Vercel, Railway, Heroku, or any Node.js host
 *
 * Usage:
 *   npm install express stripe dotenv
 *   node dist/payment/webhook-server.js
 */

import express, { Request, Response } from 'express';
import { StripeWebhookHandler, WebhookConfig } from './stripe-webhook';

/**
 * Environment variables required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook signing secret
 * - LICENSE_PRIVATE_KEY_PATH: Path to RSA private key (optional, defaults to keys/license_key)
 * - PORT: Server port (optional, defaults to 3001)
 */

// Load environment variables
const PORT = process.env.PORT || 3001;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const LICENSE_PRIVATE_KEY_PATH = process.env.LICENSE_PRIVATE_KEY_PATH;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

if (!STRIPE_WEBHOOK_SECRET) {
  console.error('❌ STRIPE_WEBHOOK_SECRET environment variable is required');
  process.exit(1);
}

// Create Express app
const app = express();

// Configure webhook handler
const config: WebhookConfig = {
  stripeSecretKey: STRIPE_SECRET_KEY,
  webhookSecret: STRIPE_WEBHOOK_SECRET,
  privateKeyPath: LICENSE_PRIVATE_KEY_PATH,
  emailConfig: {
    provider: 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.EMAIL_FROM || 'licenses@flexdoc.dev',
    fromName: 'FlexDoc',
  },
};

const webhookHandler = new StripeWebhookHandler(config);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'flexdoc-webhook-server',
    timestamp: new Date().toISOString(),
  });
});

// Stripe webhook endpoint
// IMPORTANT: Use raw body parser for webhook signature verification
app.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      console.error('❌ No stripe-signature header');
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      // Verify and parse webhook
      const event = await webhookHandler.verifyWebhook(req.body, signature);

      console.log(`✅ Webhook verified: ${event.type}`);

      // Handle event asynchronously
      webhookHandler.handleEvent(event).catch((error) => {
        console.error('❌ Error handling webhook event:', error);
      });

      // Respond immediately to Stripe
      res.json({ received: true });
    } catch (error: any) {
      console.error('❌ Webhook error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('');
    console.log('═'.repeat(60));
    console.log('  FlexDoc Webhook Server');
    console.log('═'.repeat(60));
    console.log('');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook/stripe`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('🔐 Stripe Configuration:');
    console.log(`   Secret Key: ${STRIPE_SECRET_KEY.substring(0, 10)}...`);
    console.log(`   Webhook Secret: ${STRIPE_WEBHOOK_SECRET.substring(0, 10)}...`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Set up Stripe webhook to point to this URL');
    console.log('   2. Test with: stripe listen --forward-to localhost:' + PORT + '/webhook/stripe');
    console.log('');
    console.log('Press Ctrl+C to stop');
    console.log('');
  });
}

export { app, webhookHandler };
