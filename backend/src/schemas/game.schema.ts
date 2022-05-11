
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ versionKey: false, _id: false })
export class Player {
  @Prop()
  username: string;

  @Prop()
  cards: number[];

  @Prop()
  trains: number;
}

@Schema({versionKey: false})
export class Game {
  @Prop()
  players: Player[];

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
