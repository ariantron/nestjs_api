import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { AppService } from '../src/modules/app/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    appService = moduleFixture.get<AppService>(AppService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api', () => {
    it('should redirect to /api/status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api')
        .expect(HttpStatus.FOUND);

      expect(response.headers.location).toBe('/api/status');
    });
  });

  describe('/api/status', () => {
    it('should return the app info', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/status')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(appService.info());
    });
  });
});
