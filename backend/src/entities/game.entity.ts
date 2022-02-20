export interface GameEntity {
  readonly id: string;
  readonly players: string[];
  readonly currentPlayer: number;
  readonly cardPile: number[];
  readonly availableCards: number[];
  readonly discardPile: number[];
}
