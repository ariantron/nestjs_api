import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Image {
  @Prop()
  id: string;
  @Prop()
  user_id: string;
  @Prop()
  image: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
