import { Injectable } from '@nestjs/common';
type InfoType = {
  name: string;
  version: string;
  creator: string;
  status: string;
};
@Injectable()
export class AppService {
  info(): InfoType {
    return {
      name: 'nestjs-api',
      version: '1.0.0',
      creator: 'Arian Tron <ariantron@yahoo.com>',
      status: 'online',
    };
  }
}
