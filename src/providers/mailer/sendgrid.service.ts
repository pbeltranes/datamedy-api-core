import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Lead } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import {
  CONTACT_ID,
  INTERNAL_CONTACT_ID,
  LAUNCH_ID,
  NEWSLETTER_ID,
  TEMPLATE_TYPES,
} from '@/constants';

@Injectable()
export class SendGridService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(
    to: string,
    templateId: string,
    dynamicData: Record<string, any>,
  ) {
    const message = {
      to,
      from: this.configService.get('SENDGRID_SENDER_EMAIL'),
      templateId,
      dynamicTemplateData: dynamicData,
    };

    try {
      await sgMail.send(message);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      if (error && (error as any).response) {
        console.error('SendGrid response error:', (error as any).response.body);
      }
      throw error;
    }
  }

  async handleEmailNotifications(lead: Lead): Promise<void> {
    const strategy = this.getNotificationStrategy(lead.contactType);
    strategy?.execute(lead);
  }

  private getNotificationStrategy(
    contactType: string,
  ): NotificationStrategy | undefined {
    const strategies = {
      NEWSLETTER: new NewsletterNotificationStrategy(this),
      CONTACT: new ContactNotificationStrategy(this),
      LAUNCH: new LaunchNotificationStrategy(this),
    };
    return strategies[contactType];
  }

  getDynamicDataBuilder(type: string, data: Record<string, any>) {
    return {
      NEWSLETTER: { name: data.name },
      CONTACT: { name: data.name },
      LAUNCH: { name: data.name },
      INTERNAL_CONTACT: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    }[type];
  }
}

interface NotificationStrategy {
  execute(lead: Lead): void;
}

class NewsletterNotificationStrategy implements NotificationStrategy {
  constructor(private sendGridService: SendGridService) {}

  execute(lead: Lead): void {
    const dynamicData = this.sendGridService.getDynamicDataBuilder(
      TEMPLATE_TYPES.NEWSLETTER,
      lead,
    );
    this.sendGridService.sendEmail(lead.email, NEWSLETTER_ID, dynamicData);
  }
}

class ContactNotificationStrategy implements NotificationStrategy {
  constructor(private sendGridService: SendGridService) {}

  execute(lead: Lead): void {
    const dynamicData = this.sendGridService.getDynamicDataBuilder(
      TEMPLATE_TYPES.CONTACT,
      lead,
    );
    this.sendGridService.sendEmail(lead.email, CONTACT_ID, dynamicData);

    const internalDynamicData = this.sendGridService.getDynamicDataBuilder(
      TEMPLATE_TYPES.INTERNAL_CONTACT,
      lead,
    );
    this.sendGridService.sendEmail(
      lead.email,
      INTERNAL_CONTACT_ID,
      internalDynamicData,
    );
  }
}

class LaunchNotificationStrategy implements NotificationStrategy {
  constructor(private sendGridService: SendGridService) {}

  execute(lead: Lead): void {
    const dynamicData = this.sendGridService.getDynamicDataBuilder(
      TEMPLATE_TYPES.LAUNCH,
      lead,
    );
    this.sendGridService.sendEmail(lead.email, LAUNCH_ID, dynamicData);
  }
}
