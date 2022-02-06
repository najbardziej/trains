import { Game } from 'src/schemas/game.schema';

export interface GameRoomEntity {
  readonly id: Game;
  readonly roomName: string;
  readonly players: string[];
}
