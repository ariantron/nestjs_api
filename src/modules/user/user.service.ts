import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { ImageService } from '../image/image.service';
import UserConfig from './user.config';
import { MailService } from '../mail/mail.service';
import { RabbitMQService } from '../rmq/rmq.service';
import { downloadFile } from '../../utills/download.utill';
import axios, { HttpStatusCode } from 'axios';
import { Response } from '../../interfaces/response.interface';
import { errorResponse, successResponse } from '../../utills/response.utill';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly mailService: MailService,
    private readonly imageService: ImageService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Response> {
    const newUser = new this.userModel(createUserDto);
    const isDuplicatedEmail =
      (await this.userModel.exists({
        email: newUser.email,
      })) !== null;
    if (isDuplicatedEmail)
      return errorResponse(HttpStatusCode.BadRequest, 'email should be unique');
    return await newUser
      .save()
      .then(async (res) => {
        const userName = newUser.first_name + ' ' + newUser.last_name;
        await this.mailService.sendAccountCreationNotification(
          newUser.email,
          userName,
        );
        await this.rabbitMQService.sendAccountCreationEvent(
          'user-created',
          newUser.email,
          newUser.toJSON(),
        );
        return successResponse(
          'User information has been successfully saved in the database!',
          { newUser: res },
        );
      })
      .catch((error) => {
        console.log(
          `Saving user information in the database failed! [${error}]`,
        );
        return errorResponse(
          HttpStatusCode.ServiceUnavailable,
          'Database is down',
        );
      });
  }

  async findOne(id: string): Promise<Response> {
    return await axios({
      method: 'GET',
      url: UserConfig.USERS_API_URL + id,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(async (res) => {
        return successResponse('User information received successfully!', {
          user: res.data.data,
        });
      })
      .catch((error) => {
        try {
          return errorResponse(
            error.response.status,
            `Failed to get user information! [${error}]`,
          );
        } catch (err) {
          return errorResponse(
            HttpStatusCode.InternalServerError,
            `Failed to get user information! [${error}]`,
          );
        }
      });
  }

  async findOneAvatar(id: string): Promise<Response> {
    const avatar = await this.imageService.findOne(id);
    const avatarUrl = UserConfig.USERS_API_URL + id;
    if (avatar)
      return successResponse('Avatar received successfully', {
        userId: id,
        imageUrl: avatarUrl,
        base64EncodedImage: (await avatar).image,
      });
    return await axios({
      method: 'GET',
      url: avatarUrl,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(async (res) => {
        const avatarUrl = res.data.data.avatar;
        return downloadFile(avatarUrl, 'downloads')
          .then(async (imageFilePath) => {
            const image: string = fs.readFileSync(imageFilePath, {
              encoding: 'base64',
            });
            await this.imageService.save(id, image);
            return successResponse('User avatar received successfully!', {
              userId: id,
              imageUrl: avatarUrl,
              base64EncodedImage: image,
            });
          })
          .catch((error) => {
            return errorResponse(
              HttpStatusCode.InternalServerError,
              `Failed to get user avatar! [${error}]`,
            );
          });
      })
      .catch((error) => {
        try {
          return errorResponse(
            error.response.status,
            `Failed to get user avatar! [${error}]`,
          );
        } catch (err) {
          return errorResponse(
            HttpStatusCode.InternalServerError,
            `Failed to get user avatar! [${error}]`,
          );
        }
      });
  }

  async deleteAvatar(id: string) {
    try {
      await this.imageService.delete(id);
      return successResponse('User avatar removed successfully!', {
        deletedAvatarUserId: id,
      });
    } catch (error) {
      return errorResponse(
        HttpStatusCode.InternalServerError,
        `Failed to remove user avatar! [${error}]`,
      );
    }
  }
}
