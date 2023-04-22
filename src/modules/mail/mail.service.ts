import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAccountCreationNotification(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'New user account',
        template: './success',
        context: {
          name: name,
        },
      });
      console.log(
        `Send account creation notification email to <${email}> has succeed!`,
      );
    } catch (error) {
      console.log(
        `Send account creation notification email to <${email}> has failed! [${error}]`,
      );
    }
  }
}
