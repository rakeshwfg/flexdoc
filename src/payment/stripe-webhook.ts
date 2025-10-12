/**
 * Stripe Webhook Handler for FlexDoc Pro
 *
 * This service handles Stripe webhook events for:
 * - Payment success
 * - Subscription creation/update/cancellation
 * - Automatic license generation
 * - Email delivery
 *
 * Deploy this as a serverless function or standalone service
 */

import Stripe from 'stripe';
import { LicenseGenerator } from '../licensing/license-generator';
import { LicenseTier } from '../licensing/license-types';

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  /** Stripe secret key */
  stripeSecretKey: string;

  /** Stripe webhook signing secret */
  webhookSecret: string;

  /** Path to private key for license generation */
  privateKeyPath?: string;

  /** Email service configuration */
  emailConfig?: EmailConfig;

  /** Database configuration */
  databaseConfig?: DatabaseConfig;
}

/**
 * Email service configuration
 */
export interface EmailConfig {
  provider: 'sendgrid' | 'resend' | 'smtp';
  apiKey?: string;
  from: string;
  fromName?: string;
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  provider: 'firebase' | 'supabase' | 'mongodb' | 'postgres';
  connectionString?: string;
  apiKey?: string;
  projectId?: string;
}

/**
 * License record for database
 */
export interface LicenseRecord {
  id: string;
  licenseKey: string;
  email: string;
  name?: string;
  tier: LicenseTier;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId: string;
  status: 'active' | 'cancelled' | 'expired';
  createdAt: number;
  expiresAt?: number;
  lastRenewed?: number;
  metadata?: Record<string, any>;
}

/**
 * Stripe Webhook Handler
 */
export class StripeWebhookHandler {
  private stripe: Stripe;
  private licenseGenerator: LicenseGenerator;
  private config: WebhookConfig;

  constructor(config: WebhookConfig) {
    this.config = config;
    this.stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: '2025-09-30.clover',
    });
    this.licenseGenerator = new LicenseGenerator(config.privateKeyPath);
  }

  /**
   * Verify and parse webhook event
   */
  async verifyWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      );
    } catch (error: any) {
      throw new Error(`Webhook verification failed: ${error.message}`);
    }
  }

  /**
   * Handle webhook event
   */
  async handleEvent(event: Stripe.Event): Promise<void> {
    console.log(`📨 Received event: ${event.type}`);

    switch (event.type) {
      // One-time payment success
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      // Subscription events
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // Payment events
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`⚠️  Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Handle checkout session completed
   */
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    console.log(`✅ Checkout completed for ${session.customer_email}`);

    // Get customer details
    const customerEmail = session.customer_email;
    const customerId = session.customer as string;
    const customerName = session.customer_details?.name;

    if (!customerEmail) {
      console.error('❌ No customer email in checkout session');
      return;
    }

    // Determine tier from metadata or line items
    const tier = this.determineTierFromSession(session);
    const durationDays = this.determineDurationFromSession(session);

    // Generate license
    const licenseKey = this.licenseGenerator.generateLicense({
      email: customerEmail,
      name: customerName || undefined,
      tier,
      durationDays,
      metadata: {
        stripeCustomerId: customerId,
        stripeSessionId: session.id,
        stripePriceId: session.metadata?.price_id,
      },
    });

    // Save to database
    const licenseRecord: LicenseRecord = {
      id: this.generateId(),
      licenseKey,
      email: customerEmail,
      name: customerName || undefined,
      tier,
      stripeCustomerId: customerId,
      stripeSubscriptionId: session.subscription as string | undefined,
      stripePriceId: session.metadata?.price_id || '',
      status: 'active',
      createdAt: Date.now(),
      expiresAt: durationDays ? Date.now() + durationDays * 24 * 60 * 60 * 1000 : undefined,
    };

    await this.saveLicense(licenseRecord);

    // Send email
    await this.sendLicenseEmail(customerEmail, customerName || undefined, licenseKey, tier);

    console.log(`✅ License generated and sent to ${customerEmail}`);
  }

  /**
   * Handle subscription created
   */
  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    console.log(`✅ Subscription created: ${subscription.id}`);

    const customer = await this.stripe.customers.retrieve(subscription.customer as string);
    if (customer.deleted) {
      console.error('❌ Customer was deleted');
      return;
    }

    const customerEmail = customer.email;
    const customerName = customer.name;

    if (!customerEmail) {
      console.error('❌ No customer email');
      return;
    }

    // Generate or update license
    const tier = this.determineTierFromSubscription(subscription);
    const licenseKey = this.licenseGenerator.generateLicense({
      email: customerEmail,
      name: customerName || undefined,
      tier,
      durationDays: 30, // Monthly renewal
      metadata: {
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
      },
    });

    const licenseRecord: LicenseRecord = {
      id: this.generateId(),
      licenseKey,
      email: customerEmail,
      name: customerName || undefined,
      tier,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id || '',
      status: 'active',
      createdAt: Date.now(),
      lastRenewed: Date.now(),
    };

    await this.saveLicense(licenseRecord);
    await this.sendLicenseEmail(customerEmail, customerName || undefined, licenseKey, tier);
  }

  /**
   * Handle subscription updated
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    console.log(`🔄 Subscription updated: ${subscription.id}`);

    // Update license status in database
    await this.updateLicenseStatus(
      subscription.id,
      subscription.status === 'active' ? 'active' : 'cancelled'
    );
  }

  /**
   * Handle subscription deleted
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    console.log(`❌ Subscription cancelled: ${subscription.id}`);

    // Mark license as cancelled
    await this.updateLicenseStatus(subscription.id, 'cancelled');
  }

  /**
   * Handle invoice payment succeeded (subscription renewal)
   */
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log(`✅ Invoice paid: ${invoice.id}`);

    // Check if this is a subscription invoice
    const invoiceAny = invoice as any;
    const subscriptionId = typeof invoiceAny.subscription === 'string'
      ? invoiceAny.subscription
      : invoiceAny.subscription?.id;

    if (!subscriptionId) {
      return; // Not a subscription invoice
    }

    // Extend license expiration
    await this.extendLicense(subscriptionId, 30); // Extend by 30 days
  }

  /**
   * Handle invoice payment failed
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log(`❌ Invoice payment failed: ${invoice.id}`);

    // Send payment failed notification
    const customerEmail = (invoice.customer_email || '') as string;
    if (customerEmail) {
      await this.sendPaymentFailedEmail(customerEmail);
    }
  }

  /**
   * Determine tier from session
   */
  private determineTierFromSession(session: Stripe.Checkout.Session): LicenseTier {
    // Check metadata
    if (session.metadata?.tier) {
      return session.metadata.tier as LicenseTier;
    }

    // Check price ID (you'll set these up in Stripe)
    const priceId = session.metadata?.price_id;
    if (priceId?.includes('pro')) {
      return 'pro';
    }
    if (priceId?.includes('enterprise')) {
      return 'enterprise';
    }

    return 'pro'; // Default
  }

  /**
   * Determine duration from session
   */
  private determineDurationFromSession(session: Stripe.Checkout.Session): number | undefined {
    // Check for one-time payment (lifetime)
    if (session.mode === 'payment') {
      return undefined; // Lifetime
    }

    // Check metadata
    if (session.metadata?.duration_days) {
      return parseInt(session.metadata.duration_days, 10);
    }

    // Subscription (monthly by default)
    return 30;
  }

  /**
   * Determine tier from subscription
   */
  private determineTierFromSubscription(subscription: Stripe.Subscription): LicenseTier {
    const priceId = subscription.items.data[0]?.price.id || '';

    if (priceId.includes('enterprise')) {
      return 'enterprise';
    }

    return 'pro';
  }

  /**
   * Save license to database
   */
  private async saveLicense(license: LicenseRecord): Promise<void> {
    // TODO: Implement database storage
    // This is a placeholder - implement based on your database choice
    console.log('💾 Saving license to database:', license.email);

    // Example for Firebase:
    // await firebase.firestore().collection('licenses').doc(license.id).set(license);

    // Example for Supabase:
    // await supabase.from('licenses').insert(license);

    // For now, just log
    console.log('✅ License saved (placeholder)');
  }

  /**
   * Update license status
   */
  private async updateLicenseStatus(
    subscriptionId: string,
    status: 'active' | 'cancelled' | 'expired'
  ): Promise<void> {
    console.log(`🔄 Updating license status for subscription ${subscriptionId} to ${status}`);

    // TODO: Implement database update
    console.log('✅ Status updated (placeholder)');
  }

  /**
   * Extend license expiration
   */
  private async extendLicense(subscriptionId: string, days: number): Promise<void> {
    console.log(`⏰ Extending license for subscription ${subscriptionId} by ${days} days`);

    // TODO: Implement database update
    console.log('✅ License extended (placeholder)');
  }

  /**
   * Send license email
   */
  private async sendLicenseEmail(
    email: string,
    name: string | undefined,
    licenseKey: string,
    tier: LicenseTier
  ): Promise<void> {
    console.log(`📧 Sending license email to ${email}`);

    const emailBody = this.generateLicenseEmail(name, licenseKey, tier);

    // TODO: Implement email sending
    // This is a placeholder - implement based on your email provider

    // Example for SendGrid:
    // await sendgrid.send({ to: email, subject: '...', html: emailBody });

    // Example for Resend:
    // await resend.emails.send({ to: email, subject: '...', html: emailBody });

    console.log('✅ Email sent (placeholder)');
    console.log('Email preview:');
    console.log(emailBody);
  }

  /**
   * Send payment failed email
   */
  private async sendPaymentFailedEmail(email: string): Promise<void> {
    console.log(`📧 Sending payment failed notification to ${email}`);

    // TODO: Implement email sending
    console.log('✅ Notification sent (placeholder)');
  }

  /**
   * Generate license email HTML
   */
  private generateLicenseEmail(
    name: string | undefined,
    licenseKey: string,
    tier: LicenseTier
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .license-box { background: white; border: 2px solid #e5e7eb; padding: 20px; margin: 20px 0; }
    .license-key { background: #f3f4f6; padding: 15px; font-family: monospace; word-break: break-all; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to FlexDoc ${tier.charAt(0).toUpperCase() + tier.slice(1)}!</h1>
    </div>

    <div class="content">
      <p>Hi ${name || 'there'},</p>

      <p>Thank you for purchasing FlexDoc ${tier.charAt(0).toUpperCase() + tier.slice(1)}! Your license is now active.</p>

      <div class="license-box">
        <h2>Your License Key</h2>
        <div class="license-key">${licenseKey}</div>
      </div>

      <h3>How to Activate</h3>

      <p><strong>Option 1: Environment Variable (Recommended)</strong></p>
      <pre style="background: #f3f4f6; padding: 15px;">export FLEXDOC_LICENSE_KEY="${licenseKey}"</pre>

      <p><strong>Option 2: In Your Code</strong></p>
      <pre style="background: #f3f4f6; padding: 15px;">const flexdoc = new FlexDoc({
  licenseKey: '${licenseKey}'
});</pre>

      <h3>What's Included</h3>
      <ul>
        <li>✅ Professional Mode (ML-powered optimization)</li>
        <li>✅ 25+ Premium Themes</li>
        <li>✅ Cloud Storage Integration</li>
        <li>✅ REST API Server</li>
        <li>✅ Priority Support</li>
      </ul>

      <p style="text-align: center;">
        <a href="https://github.com/rakeshwfg/flexdoc#pro-features" class="button">View Documentation</a>
      </p>

      <p>Need help? Just reply to this email!</p>

      <p>Best regards,<br>The FlexDoc Team</p>
    </div>

    <div class="footer">
      <p>FlexDoc - Professional Document Conversion<br>
      <a href="https://github.com/rakeshwfg/flexdoc">Documentation</a> |
      <a href="https://rakeshwfg.github.io/flexdoc/pricing">Pricing</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `lic_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
}
