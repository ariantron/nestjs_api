import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({
    required: false,
  })
  id: string;

  @Prop({
    required: true,
  })
  first_name: string;

  @Prop({
    required: true,
  })
  last_name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: false,
  })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
