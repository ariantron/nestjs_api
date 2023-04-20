import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { MailService } from '../../common/services/mail.service';
import { ClientProxy } from '@nestjs/microservices';
import * as fs from 'fs';
import { ImageService } from '../image/image.service';
import { downloadFile } from '../../common/utills/download.utill';
import UserConfig from './user.config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject('RMQ_SERVICE') private client: ClientProxy,
    private readonly mailService: MailService,
    private readonly imageService: ImageService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    const userName = newUser.first_name + ' ' + newUser.last_name;
    const subject = 'New user account';
    const text = 'Your account has been successfully created.';
    const html = '<h2>Your account has been successfully created.</h2>';
    await this.mailService.sendMail(
      newUser.email,
      userName,
      subject,
      text,
      html,
    );
    this.client.emit('user-created', newUser.toJSON());
    return await newUser.save();
  }

  async findOne(id: string): Promise<User> {
    const response = await fetch(UserConfig.users_api_url + id, {
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
    const response = await fetch(UserConfig.users_api_url + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Error! status: ${response.status}`);
    const avatarUrl = (await response.json()).data.avatar;
    let image = null;
    downloadFile(avatarUrl, async (imageFilePath) => {
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
