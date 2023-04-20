import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().DB_URL),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
