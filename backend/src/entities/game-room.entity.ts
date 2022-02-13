import { Game } from 'src/schemas/game.schema';

export interface GameRoomEntity {
  readonly id: string;
  readonly roomName: string;
  readonly players: string[];
}
