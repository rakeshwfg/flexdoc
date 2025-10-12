# 💳 Stripe Integration & Payment Setup Guide

Complete guide for setting up Stripe payments and webhooks for FlexDoc Pro.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Stripe Account Setup](#stripe-account-setup)
3. [Product Configuration](#product-configuration)
4. [Webhook Server Deployment](#webhook-server-deployment)
5. [Testing with Stripe CLI](#testing-with-stripe-cli)
6. [Production Deployment](#production-deployment)
7. [Email Service Setup](#email-service-setup)
8. [Database Setup (Optional)](#database-setup-optional)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ Node.js 14+ installed
- ✅ FlexDoc v1.9.0+ installed
- ✅ Stripe account (free to create)
- ✅ RSA keys generated (for license signing)
- ✅ Email service account (SendGrid, Resend, or SMTP)

---

## Stripe Account Setup

### Step 1: Create Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up for a free account
3. Complete business information
4. Enable test mode for development

### Step 2: Get API Keys

1. Navigate to **Developers** → **API keys**
2. Copy your keys:
   - **Publishable key**: `pk_test_...` (for frontend)
   - **Secret key**: `sk_test_...` (for backend)
3. Add to `.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

---

## Product Configuration

### Step 1: Create Products

1. Go to **Products** → **Add Product**
2. Create products for each tier:

#### FlexDoc Pro - Monthly
- **Name**: FlexDoc Pro (Monthly)
- **Description**: Professional document conversion with all Pro features
- **Price**: $49/month
- **Billing**: Recurring monthly
- **Metadata**: Add `tier: pro`, `duration_days: 30`

#### FlexDoc Pro - Annual
- **Name**: FlexDoc Pro (Annual)
- **Description**: Professional document conversion with all Pro features (Save 17%)
- **Price**: $490/year
- **Billing**: Recurring yearly
- **Metadata**: Add `tier: pro`, `duration_days: 365`

#### FlexDoc Pro - Lifetime
- **Name**: FlexDoc Pro (Lifetime)
- **Description**: One-time payment, use forever
- **Price**: $999 one-time
- **Billing**: One-time payment
- **Metadata**: Add `tier: pro` (no duration_days = lifetime)

### Step 2: Copy Price IDs

After creating products, copy the Price IDs (e.g., `price_1ABC...`). You'll use these in your checkout links.

---

## Webhook Server Deployment

### Local Development

1. **Install Dependencies**:
```bash
npm install
```

2. **Configure Environment**:
```bash
cp .env.example .env
# Edit .env with your Stripe keys
```

3. **Build & Run**:
```bash
npm run build
npm run webhook:dev
```

Server will start on `http://localhost:3001`

### Endpoints

- **Health Check**: `GET /health`
- **Stripe Webhook**: `POST /webhook/stripe`

---

## Testing with Stripe CLI

### Step 1: Install Stripe CLI

**macOS (Homebrew)**:
```bash
brew install stripe/stripe-cli/stripe
```

**Linux**:
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Windows**:
Download from [GitHub releases](https://github.com/stripe/stripe-cli/releases)

### Step 2: Login to Stripe

```bash
stripe login
```

### Step 3: Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3001/webhook/stripe
```

This will output a webhook signing secret:
```
> Ready! Your webhook signing secret is whsec_xxx... (^C to quit)
```

Add this to your `.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Step 4: Test Webhook

In another terminal, trigger a test payment:

```bash
stripe trigger checkout.session.completed
```

You should see:
```
✅ Webhook verified: checkout.session.completed
✅ Checkout completed for test@example.com
✅ License generated and sent to test@example.com
```

---

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Create `vercel.json`**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/payment/webhook-server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/webhook/stripe",
      "dest": "dist/payment/webhook-server.js"
    },
    {
      "src": "/health",
      "dest": "dist/payment/webhook-server.js"
    }
  ],
  "env": {
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "STRIPE_WEBHOOK_SECRET": "@stripe-webhook-secret",
    "LICENSE_PRIVATE_KEY_PATH": "@license-private-key-path"
  }
}
```

3. **Deploy**:
```bash
npm run build
vercel --prod
```

4. **Set Environment Variables**:
```bash
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add LICENSE_PRIVATE_KEY_PATH
```

### Option 2: Railway

1. **Install Railway CLI**:
```bash
npm i -g @railway/cli
```

2. **Login & Initialize**:
```bash
railway login
railway init
```

3. **Set Environment Variables**:
```bash
railway variables set STRIPE_SECRET_KEY=sk_test_...
railway variables set STRIPE_WEBHOOK_SECRET=whsec_...
railway variables set PORT=3001
```

4. **Deploy**:
```bash
railway up
```

### Option 3: Heroku

1. **Install Heroku CLI**:
```bash
npm install -g heroku
```

2. **Create App**:
```bash
heroku create flexdoc-webhook
```

3. **Set Environment Variables**:
```bash
heroku config:set STRIPE_SECRET_KEY=sk_test_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Deploy**:
```bash
git push heroku main
```

### Step 5: Configure Stripe Webhook (Production)

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: Your production URL (e.g., `https://your-app.vercel.app/webhook/stripe`)
3. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Save** and copy the **Signing secret**
5. Update your production environment with the signing secret

---

## Email Service Setup

### Option 1: SendGrid (Recommended)

1. **Sign up**: [https://signup.sendgrid.com/](https://signup.sendgrid.com/)
2. **Create API Key**: Settings → API Keys → Create API Key
3. **Verify Sender**: Settings → Sender Authentication
4. **Configure**:
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key
EMAIL_FROM=licenses@yourdomain.com
EMAIL_FROM_NAME=FlexDoc
```

### Option 2: Resend

1. **Sign up**: [https://resend.com/signup](https://resend.com/signup)
2. **Create API Key**: API Keys → Create
3. **Verify Domain**: Domains → Add Domain
4. **Configure**:
```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=licenses@yourdomain.com
```

### Option 3: SMTP

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=licenses@yourdomain.com
```

---

## Database Setup (Optional)

Storing licenses in a database is optional but recommended for tracking and management.

### Option 1: Firebase

1. **Create Project**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Enable Firestore**: Build → Firestore Database → Create
3. **Get Credentials**: Project Settings → Service Accounts → Generate Key
4. **Configure**:
```bash
DATABASE_PROVIDER=firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Option 2: Supabase

1. **Create Project**: [https://app.supabase.com/](https://app.supabase.com/)
2. **Create Table**:
```sql
CREATE TABLE licenses (
  id TEXT PRIMARY KEY,
  license_key TEXT NOT NULL,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  stripe_customer_id TEXT,
  status TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  expires_at BIGINT
);
```
3. **Configure**:
```bash
DATABASE_PROVIDER=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

---

## Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook endpoint is publicly accessible**:
```bash
curl https://your-app.com/health
```

2. **Verify Stripe webhook is configured**:
   - Go to Developers → Webhooks
   - Check endpoint URL is correct
   - Ensure events are selected

3. **Check webhook signing secret**:
   - Must match between Stripe dashboard and `.env`

### License Generation Fails

1. **Check private key path**:
```bash
ls -la keys/license_key
```

2. **Verify key permissions**:
```bash
chmod 600 keys/license_key
```

### Email Not Sending

1. **Check email provider configuration**
2. **Verify API keys are correct**
3. **Check sender email is verified**
4. **Review email service logs**

### Common Errors

**Error**: `Webhook verification failed`
- **Solution**: Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard

**Error**: `Private key not found`
- **Solution**: Generate keys with `ssh-keygen -t rsa -b 2048 -m PEM -f keys/license_key -N ""`

**Error**: `Email API key invalid`
- **Solution**: Regenerate API key in email provider dashboard

---

## Next Steps

Once everything is set up:

1. ✅ Test end-to-end payment flow
2. ✅ Create checkout links/buttons for your website
3. ✅ Monitor webhooks in Stripe dashboard
4. ✅ Set up customer portal (optional)
5. ✅ Switch to live mode when ready

---

## Support

- **FlexDoc Issues**: [GitHub Issues](https://github.com/rakeshwfg/flexdoc/issues)
- **Stripe Docs**: [https://stripe.com/docs](https://stripe.com/docs)
- **Email**: rakesh16@gmail.com

---

## Quick Reference

### Environment Variables Checklist

```bash
# Required
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ LICENSE_PRIVATE_KEY_PATH

# Email (choose one)
✅ EMAIL_PROVIDER
✅ SENDGRID_API_KEY (or RESEND_API_KEY or SMTP_*)
✅ EMAIL_FROM

# Optional
☐ DATABASE_PROVIDER
☐ FIREBASE_* (or SUPABASE_* or MONGODB_URI)
```

### Test Payment URLs

After deploying, create checkout links:
- Monthly: `https://your-site.com/checkout?price=price_monthly_id`
- Annual: `https://your-site.com/checkout?price=price_annual_id`
- Lifetime: `https://your-site.com/checkout?price=price_lifetime_id`

---

**Ready to accept payments!** 🚀
