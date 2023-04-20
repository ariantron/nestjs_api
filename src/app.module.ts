import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './common/services/mail.service';
import { UserModule } from './modules/user/user.module';
import { GlobalConstants } from './common/constants/global';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: GlobalConstants.DB_URI,
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
