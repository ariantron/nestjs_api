import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  id: string;
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop()
  email: string;
  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
