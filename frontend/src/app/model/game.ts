export interface Game {
  id: string;
  players: any;
  currentPlayer: number;
  cardPile: number[];
  availableCards: number[];
  discardPile: number[];
}