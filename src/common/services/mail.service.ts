import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    email: string,
    name: string,
    subject: string,
    text: string,
    html: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        text: text, // plaintext body
        html: html, // HTML body content
        context: {
          name: name,
        },
      });
    } catch (err) {
      console.log(`Send Email Error [${err}]`);
    }
  }
}
