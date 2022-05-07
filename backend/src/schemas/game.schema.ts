
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({versionKey: false})
export class Game {
  
  @Prop(raw([{
    username: { type: String },
    cards: { type: [Number] },
    trains: { type: Number },
  }]))
  players: Record<string, any>[];

  @Prop()
  currentPlayer: number;

  @Prop()
  cardPile: number[];

  @Prop()
  availableCards: number[];

  @Prop()
  discardPile: number[];

};

export const GameSchema = SchemaFactory.createForClass(Game);
