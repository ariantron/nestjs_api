import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
