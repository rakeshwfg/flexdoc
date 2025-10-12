/**
 * FlexDoc Payment Module
 *
 * Handles Stripe payments, webhooks, and license delivery
 */

export { StripeWebhookHandler } from './stripe-webhook';
export type {
  WebhookConfig,
  EmailConfig,
  DatabaseConfig,
  LicenseRecord,
} from './stripe-webhook';

export { app as webhookServer, webhookHandler } from './webhook-server';
