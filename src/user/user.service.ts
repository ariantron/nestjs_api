import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { MailService } from '../mail.service';
import { ClientProxy } from '@nestjs/microservices';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { ImageService } from '../image/image.service';

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
    await this.mailService.sendMail(newUser.email, userName);
    this.client.emit('user-created', newUser.toJSON());
    return await newUser.save();
  }

  async findOne(id: string): Promise<User> {
    const response = await fetch(`https://reqres.in/api/users/${id}`, {
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
    const response = await fetch(`https://reqres.in/api/users/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Error! status: ${response.status}`);
    const avatarUrl = (await response.json()).data.avatar;
    let image = null;
    this.downloadFile(avatarUrl, async (imageFilePath) => {
      image = fs.readFileSync(imageFilePath, 'base64');
      await this.imageService.save(id, image);
    });
    if (image) return image;
    else return avatarUrl;
  }

  async deleteAvatar(id: string) {
    return await this.imageService.delete(id);
  }

  downloadFile(url, callback) {
    const filename = path.basename(url);
    const downloadsDir = 'downloads';
    if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);
    const filePath = `${downloadsDir}/${filename}`;
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        callback(filePath);
      });
    });
    return filePath;
  }
}
