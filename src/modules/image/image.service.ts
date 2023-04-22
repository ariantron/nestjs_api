import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from './image.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}

  async save(userId: string, image: string) {
    const newImage = new this.imageModel({ user_id: userId, image: image });
    await newImage.save().catch((error) => {
      console.log(`Saving user image in the database failed! [${error}]`);
    });
  }

  async findOne(userId: string) {
    return await this.imageModel.findOne({ user_id: userId }).exec();
  }

  async delete(userId: string) {
    const filePath = `downloads/${userId}-image.jpg`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await this.imageModel.deleteMany({ user_id: userId }).exec();
  }
}
