import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('info', () => {
    it('should return app information', () => {
      const expectedInfo = {
        name: 'nestjs-api',
        version: '1.0.0',
        creator: 'Arian Tron <ariantron@yahoo.com>',
        status: 'online',
      };
      jest.spyOn(appService, 'info').mockReturnValue(expectedInfo);

      expect(appController.info()).toBe(expectedInfo);
    });
  });
});