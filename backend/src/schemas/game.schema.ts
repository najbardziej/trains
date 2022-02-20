
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({versionKey: false})
export class Game {
  @Prop([String])
  players: string[];

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
