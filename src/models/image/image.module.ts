import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './image.schema';

@Module({
  providers: [ImageService],
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
  ],
  exports: [ImageService],
})
export class ImageModule {}
