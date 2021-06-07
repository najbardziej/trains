import { Game } from 'src/schemas/game.schema';

export interface GameEntity {
  readonly id: Game;
  readonly roomName: string;
  readonly player1: string;
  readonly player2: string;
  readonly player3: string;
  readonly player4: string;
  readonly player5: string;
}
