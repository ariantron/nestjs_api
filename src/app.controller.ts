import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { HttpStatusCode } from 'axios';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @HttpCode(HttpStatusCode.Found)
  index(@Res() res: Response) {
    res.redirect('/status');
  }
  @Get('/status')
  @HttpCode(HttpStatusCode.Ok)
  info() {
    return this.appService.info();
  }
}
