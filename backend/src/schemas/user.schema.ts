
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({versionKey: false})
export class User {
  @Prop({unique: true})
  username: string;

  @Prop({unique: true})
  email: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;
};

export const UserSchema = SchemaFactory.createForClass(User);
