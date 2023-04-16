import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
      }),
    }),
    UserModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
