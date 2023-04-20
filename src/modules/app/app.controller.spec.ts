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
    it('should return an object with name, version, creator, and status', () => {
      const result = appService.info();
      expect(result).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          version: expect.any(String),
          creator: expect.any(String),
          status: expect.any(String),
        }),
      );
    });
  });
});
