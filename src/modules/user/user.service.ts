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
import { downloadFile } from 'src/utills/download.utill';
import { HttpStatusCode } from 'axios';
import { ApiResponse } from '../../config/api.response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly mailService: MailService,
    private readonly imageService: ImageService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    const isDuplicatedEmail =
      (await this.userModel.exists({
        email: newUser.email,
      })) !== null;
    if (isDuplicatedEmail) {
      return new ApiResponse(
        HttpStatusCode.BadRequest,
        'Bad Request',
        null,
        'email should be unique',
      );
    }
    newUser
      .save()
      .then(async (res) => {
        const userName = newUser.first_name + ' ' + newUser.last_name;
        await this.mailService.sendAccountCreationNotification(
          newUser.email,
          userName,
        );
        this.rabbitMQService.send('user-created', newUser.toJSON());
        return new ApiResponse(
          HttpStatusCode.Ok,
          'User information has been successfully saved in the database.',
          res,
          null,
        );
      })
      .catch((error) => {
        console.log(`Save user to database has failed.\r\n${error}`);
        return new ApiResponse(
          HttpStatusCode.ServiceUnavailable,
          'Database is down',
          null,
          'Service Unavailable',
        );
      });
  }

  async findOne(id: string): Promise<User> {
    const response = await fetch(UserConfig.USERS_API_URL + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Error! status: ${response.status}`);
    return (await response.json()).data;
  }

  async findOneAvatar(id: string) {
    const avatar = await this.imageService.findOne(id);
    if (avatar) return (await avatar).image;
    const response = await fetch(UserConfig.USERS_API_URL + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Error! status: ${response.status}`);
    const avatarUrl = (await response.json()).data.avatar;
    let image = null;
    downloadFile(avatarUrl, 'downloads', async (imageFilePath) => {
      image = fs.readFileSync(imageFilePath, 'base64');
      await this.imageService.save(id, image);
    });
    if (image) return image;
    else return avatarUrl;
  }

  async deleteAvatar(id: string) {
    return await this.imageService.delete(id);
  }
}
