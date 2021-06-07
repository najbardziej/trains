
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({versionKey: false})
export class Game {
  @Prop()
  roomName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  player1: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  player2: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  player3: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  player4: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  player5: User;
};

export const GameSchema = SchemaFactory.createForClass(Game);
