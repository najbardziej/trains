import { Game } from 'src/schemas/game.schema';

export interface GameRoomEntity {
  readonly id: number;
  readonly roomName: string;
  readonly players: string[];
}
