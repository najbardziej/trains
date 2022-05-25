
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameMapDocument = GameMap & Document;

@Schema({versionKey: false})
export class GameMap {
  @Prop({unique: true})
  gameId: string;

  @Prop([])
  nodes: any[];

  @Prop([])
  edges: any[];

};

export const GameMapSchema = SchemaFactory.createForClass(GameMap);
