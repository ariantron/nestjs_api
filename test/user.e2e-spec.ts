import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';

describe('UserController (e2e)', () => {
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

  describe('/api/users', () => {
    it(
      'should create a user',
      () => {
        return request(app.getHttpServer())
          .post('/api/users')
          .send({
            first_name: 'John',
            last_name: 'Dow',
            email: 'john.doe@example.com',
            avatar: 'avatar',
          })
          .expect(HttpStatus.CREATED)
          .then((response) => {
            expect(response.body).toHaveProperty('_id');
            expect(response.body.first_name).toEqual('John');
          });
      },
      50 * 1000,
    );

    it('should find a user by id', () => {
      return request(app.getHttpServer())
        .get('/api/users/1')
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
        });
    });

    it('should find a user avatar by id', () => {
      return request(app.getHttpServer())
        .get('/api/users/1/avatar')
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('data');
        });
    });

    it('should delete a user avatar by id', () => {
      return request(app.getHttpServer())
        .delete('/api/users/1/avatar')
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });
});
