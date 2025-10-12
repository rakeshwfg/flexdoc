/**
 * Email Service for License Delivery
 *
 * Supports multiple providers: SendGrid, Resend, SMTP
 */

import { EmailConfig } from './stripe-webhook';

/**
 * Email data
 */
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Email service interface
 */
export interface IEmailService {
  send(data: EmailData): Promise<void>;
}

/**
 * SendGrid email service
 */
export class SendGridEmailService implements IEmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async send(data: EmailData): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key is required');
    }

    // TODO: Implement SendGrid integration
    // npm install @sendgrid/mail
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(this.config.apiKey);
    //
    // await sgMail.send({
    //   to: data.to,
    //   from: { email: this.config.from, name: this.config.fromName },
    //   subject: data.subject,
    //   html: data.html,
    //   text: data.text
    // });

    console.log('📧 SendGrid email would be sent to:', data.to);
    console.log('Subject:', data.subject);
  }
}

/**
 * Resend email service
 */
export class ResendEmailService implements IEmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async send(data: EmailData): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('Resend API key is required');
    }

    // TODO: Implement Resend integration
    // npm install resend
    // const { Resend } = require('resend');
    // const resend = new Resend(this.config.apiKey);
    //
    // await resend.emails.send({
    //   from: `${this.config.fromName} <${this.config.from}>`,
    //   to: data.to,
    //   subject: data.subject,
    //   html: data.html
    // });

    console.log('📧 Resend email would be sent to:', data.to);
    console.log('Subject:', data.subject);
  }
}

/**
 * SMTP email service
 */
export class SMTPEmailService implements IEmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async send(data: EmailData): Promise<void> {
    // TODO: Implement SMTP integration
    // npm install nodemailer
    // const nodemailer = require('nodemailer');
    //
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS
    //   }
    // });
    //
    // await transporter.sendMail({
    //   from: `${this.config.fromName} <${this.config.from}>`,
    //   to: data.to,
    //   subject: data.subject,
    //   html: data.html,
    //   text: data.text
    // });

    console.log('📧 SMTP email would be sent to:', data.to);
    console.log('Subject:', data.subject);
  }
}

/**
 * Console email service (for testing)
 */
export class ConsoleEmailService implements IEmailService {
  async send(data: EmailData): Promise<void> {
    console.log('');
    console.log('=' .repeat(60));
    console.log('📧 EMAIL (Console Mode)');
    console.log('='.repeat(60));
    console.log('To:', data.to);
    console.log('Subject:', data.subject);
    console.log('');
    console.log('HTML:');
    console.log(data.html);
    console.log('='.repeat(60));
    console.log('');
  }
}

/**
 * Email service factory
 */
export class EmailServiceFactory {
  static create(config: EmailConfig): IEmailService {
    switch (config.provider) {
      case 'sendgrid':
        return new SendGridEmailService(config);
      case 'resend':
        return new ResendEmailService(config);
      case 'smtp':
        return new SMTPEmailService(config);
      default:
        // Return console service for development
        return new ConsoleEmailService();
    }
  }
}
