import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import configuration from '../../config/configuration';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: configuration().MAIL_HOST,
        port: configuration().MAIL_PORT,
        ignoreTLS: configuration().MAIL_IGNORE_TLS,
        secure: configuration().MAIL_SECURE,
        auth: {
          user: configuration().MAIL_USERNAME,
          pass: configuration().MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${configuration().MAIL_FROM_NAME}"
                  <${configuration().MAIL_FROM_ADDRESS}>`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
