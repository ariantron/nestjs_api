import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import { faker } from '@faker-js/faker';

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

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(HttpStatus.OK);

      expect(response.body.data.newUser).toEqual(
        expect.objectContaining({
          ...{
            _id: expect.any(String),
            __v: expect.any(Number),
          },
          ...createUserDto,
        }),
      );
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const response = await request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .expect(HttpStatus.OK);

      expect(response.body.data.user.id.toString()).toEqual(userId);
    });
  });

  describe('GET /api/users/:id/avatar', () => {
    it('should return a user avatar by ID', async () => {
      const userId = '1';
      const response = await request(app.getHttpServer())
        .get(`/api/users/${userId}/avatar`)
        .expect(HttpStatus.OK);

      expect(response.body.data.userId.toString()).toEqual(userId);
    });
  });

  describe('DELETE /api/users/:id/avatar', () => {
    it('should delete a user avatar by ID', async () => {
      const userId = '1';
      const response = await request(app.getHttpServer())
        .delete(`/api/users/${userId}/avatar`)
        .expect(HttpStatus.OK);

      expect(response.body.data.deletedAvatarUserId.toString()).toEqual(userId);
    });
  });
});
