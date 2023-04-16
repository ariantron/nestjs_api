import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'New User',
        text: 'Welcome!', // plaintext body
        html: '<b>welcome!</b>', // HTML body content
        context: {
          name: name,
        },
      });
    } catch (err) {
      console.log(`Send Email Error [${err}]`);
    }
  }
}
