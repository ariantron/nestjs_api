import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Image {
  @Prop({
    required: true,
  })
  id: string;

  @Prop({
    required: true,
  })
  user_id: string;

  @Prop({
    required: true,
  })
  image: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
