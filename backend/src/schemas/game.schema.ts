
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({versionKey: false})
export class Game {
  @Prop()
  roomName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}] })
  players: User[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // owner: User;
};

export const GameSchema = SchemaFactory.createForClass(Game);
