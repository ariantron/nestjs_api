import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '../../common/services/mail.service';
import { ImageModule } from '../image/image.module';
import { GlobalConstants } from "../../common/constants/global";
import { RabbitMQModule } from "../rmq/rmq.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          ignoreTLS: config.get<boolean>('MAIL_IGNORE_TLS'),
          secure: config.get<boolean>('MAIL_SECURE'),
          auth: {
            user: config.get<string>('MAIL_USERNAME'),
            pass: config.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get<string>('MAIL_FROM_NAME')}"
                  <${config.get<string>('MAIL_FROM_ADDRESS')}>`,
        },
      }),
    }),
    ImageModule,
    RabbitMQModule
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
