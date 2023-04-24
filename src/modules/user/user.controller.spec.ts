import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { successResponse } from '../../utills/response.utill';
import { Response } from '../../interfaces/response.interface';
import { RabbitMQService } from '../rmq/rmq.service';
import { MailService } from '../mail/mail.service';
import { ImageService } from '../image/image.service';
import { faker } from '@faker-js/faker';
import { HttpStatusCode } from 'axios';
import { User, UserSchema } from './user.schema';
import mongoose from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Image, ImageSchema } from '../image/image.schema';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useFactory: () => {
            return mongoose.model<User>('User', UserSchema);
          },
        },
        RabbitMQService,
        MailService,
        ImageService,
        {
          provide: getModelToken('Image'),
          useFactory: () => {
            return mongoose.model<Image>('Image', ImageSchema);
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      };

      const result: Response = successResponse(
        'User information has been successfully saved in the database!',
        {
          newUser: createUserDto,
        },
      );

      jest.spyOn(userService, 'create').mockResolvedValue(result);

      const response = await userController.create(createUserDto, {
        status: jest.fn(() => ({
          json: jest.fn(),
        })),
      });

      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return the user information successfully', async () => {
      const userId = '1';

      jest.spyOn(userService, 'findOne').mockImplementation(async () => {
        return {
          statusCode: 200,
          message: 'User information received successfully!',
          data: { user: { id: userId } },
        };
      });

      const response = await userService.findOne(userId);

      expect(response.statusCode).toEqual(200);
      expect(response.message).toEqual(
        'User information received successfully!',
      );
      expect(response.data.user.id).toEqual(userId);
    });
  });

  describe('findOneAvatar', () => {
    it('should return the user avatar successfully', async () => {
      const mockResponse: Response = {
        statusCode: HttpStatusCode.Ok,
        message: 'User avatar received successfully!',
        data: {
          userId: 'user_id',
          imageUrl: 'https://example.com/avatar',
          base64EncodedImage: 'base64EncodedImage',
        },
      };
      jest.spyOn(userService, 'findOneAvatar').mockResolvedValue(mockResponse);

      const result = await userService.findOneAvatar('user_id');

      expect(userService.findOneAvatar).toHaveBeenCalledWith('user_id');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors if the user avatar is not found', async () => {
      const mockResponse: Response = {
        statusCode: HttpStatusCode.NotFound,
        message: 'Failed to get user avatar!',
        error: 'Not Found',
      };
      jest.spyOn(userService, 'findOneAvatar').mockResolvedValue(mockResponse);

      const result = await userService.findOneAvatar('user_id');

      expect(userService.findOneAvatar).toHaveBeenCalledWith('user_id');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete user avatar and return success response', async () => {
      const userId = '12345';
      const successResponse = {
        statusCode: HttpStatusCode.Ok,
        message: 'User avatar removed successfully!',
        data: { deletedAvatarUserId: userId },
      };
      jest
        .spyOn(userService, 'deleteAvatar')
        .mockResolvedValue(successResponse);

      const response = await userService.deleteAvatar(userId);

      expect(userService.deleteAvatar).toHaveBeenCalledWith(userId);
      expect(response).toBe(successResponse);
    });
  });
});
