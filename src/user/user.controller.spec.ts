import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserSchema } from './user.schema';
import { MailService } from '../mail.service';
import { ImageService } from '../image/image.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { Image, ImageSchema } from '../image/image.schema';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import * as fs from 'fs';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let mailService: MailService;
  let app: INestApplication;
  let client: ClientProxy;
  let userModel: Model<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          { name: 'RMQ_SERVICE', transport: Transport.RMQ },
        ]),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useFactory: () => {
            return mongoose.model<User>('User', UserSchema);
          },
        },
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(null),
          },
        },
        ImageService,
        {
          provide: getModelToken('Image'),
          useFactory: () => {
            return mongoose.model<Image>('Image', ImageSchema);
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userModel = module.get<Model<User>>(getModelToken('User'));
    userService = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);
    client = module.get<ClientProxy>('RMQ_SERVICE');
    app = module.createNestApplication();
    await app.init();
    client = app.get('RMQ_SERVICE');
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = {
    id: 'test_id',
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.com',
    avatar: 'test-avatar',
  };

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const newUser: CreateUserDto = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'janedoe@example.com',
        avatar: 'test-avatar',
      };
      const savedUser = await userService.create(newUser);
      expect(userModel.create).toBeCalledWith(newUser);
      expect(mailService.sendMail).toBeCalledWith(
        newUser.email,
        newUser.first_name + ' ' + newUser.last_name,
      );
      expect(client.emit).toBeCalledWith('user-created', savedUser.toJSON());
      expect(savedUser).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should return user object with status code 200', async () => {
      const user = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        avatar: 'avatar',
      };
      jest.spyOn(userService, 'findOne').mockImplementation(async () => user);
      const response = await request(app.getHttpServer()).get('/api/users/1');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(user);
    });

    it('should return 404 error with status code 404 when user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockImplementation(async () => null);
      const response = await request(app.getHttpServer()).get('/api/users/x');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('findOneAvatar', () => {
    it('should return user avatar if it exists in database', async () => {
      const avatar = 'base64-encoded-image';
      jest.spyOn(userService, 'findOneAvatar').mockResolvedValue(avatar);
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const result = await userController.findOneAvatar(response, '1');
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(avatar);
      expect(result).toEqual(avatar);
    });

    it('should download user avatar if it does not exist in database', async () => {
      const avatarUrl = 'https://reqres.in/img/faces/7-image.jpg';
      const avatar = 'base64-encoded-image';
      jest.spyOn(userService, 'findOneAvatar').mockResolvedValue(null);
      jest
        .spyOn(userService, 'downloadFile')
        .mockImplementation((url, callback) => {
          return callback('downloads/image.jpg');
        });
      jest.spyOn(ImageService.prototype, 'save').mockResolvedValue(null);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(avatar);
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const result = await userController.findOneAvatar(response, '7');
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(avatar);
      expect(result).toEqual(avatar);
      expect(userService.downloadFile).toHaveBeenCalledWith(
        avatarUrl,
        expect.any(Function),
      );
      expect(ImageService.prototype.save).toHaveBeenCalledWith('7', avatar);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        'downloads/image.jpg',
        'base64',
      );
    });

    it('should throw an error if user avatar download fails', async () => {
      jest.spyOn(userService, 'findOneAvatar').mockResolvedValue(null);
      jest.spyOn(userService, 'downloadFile').mockImplementation(() => {
        throw new Error('Download failed');
      });
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await expect(
        userController.findOneAvatar(response, '7'),
      ).rejects.toThrowError('Download failed');
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar for a given user id', async () => {
      const id = '123';
      jest.spyOn(userService, 'deleteAvatar').mockResolvedValue(null);
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.deleteAvatar(response, id);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(true);
      expect(userService.deleteAvatar).toHaveBeenCalledWith(id);
    });
  });
});
