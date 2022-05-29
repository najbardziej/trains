
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;
export type PlayerDocument = Player & Document;
export type GameMapDocument = GameMap & Document;

@Schema({ versionKey: false, _id: false })
export class GameMap {
  @Prop([])
  nodes: any[];

  @Prop([])
  edges: any[];
};

@Schema({ versionKey: false, _id: false })
export class Player {
  @Prop()
  username: string;

  @Prop()
  cards: number[];

  @Prop()
  trains: number;

  @Prop([])
  availableMissions: any[]
}

@Schema({ versionKey: false, _id: false })
export class Missions {
  @Prop([])
  main: any[];

  @Prop([])
  additional: any[];
}

@Schema({versionKey: false})
export class Game {
  @Prop()
  players: Player[];

  @Prop()
  currentPlayer: number;

  @Prop()
  forcedMove: number;

  @Prop()
  cardPile: number[];

  @Prop()
  availableCards: number[];

  @Prop()
  discardPile: number[];

  @Prop()
  gameMap: GameMap;

  @Prop(Missions)
  missions: Missions;
};

export const GameSchema = SchemaFactory.createForClass(Game);
