import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

      expect(response.body).toEqual(
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
