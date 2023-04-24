import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import configuration from '../../config/configuration';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: configuration().MAIL_HOST,
        port: configuration().MAIL_PORT,
        auth: {
          user: configuration().MAIL_USERNAME,
          pass: configuration().MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${configuration().MAIL_FROM_NAME}"
                  <${configuration().MAIL_FROM_ADDRESS}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
