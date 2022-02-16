
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Document } from 'mongoose';

export type GameRoomDocument = GameRoom & Document;

@Schema({versionKey: false})
export class GameRoom {
  @Prop()
  roomName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}] })
  players: User[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // owner: User;
};

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);
