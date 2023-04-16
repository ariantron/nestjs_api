import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '../mail.service';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'RMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            queue: configService.get<string>('RMQ_PRODUCER_QUEUE'),
            urls: [configService.get<string>('RMQ_PRODUCER_URL')],
            queueOptions: {
              durable: configService.get<boolean>('RMQ_PRODUCER_QUEUE_DURABLE'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('EMAIL_HOST'),
          port: config.get<number>('EMAIL_PORT'),
          auth: {
            user: config.get<string>('EMAIL_ID'),
            pass: config.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `${config.get<string>('EMAIL_ID')}@
          ${config.get<string>('EMAIL_HOST')}`,
        },
      }),
    }),
    ImageModule,
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
