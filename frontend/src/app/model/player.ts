import { Mission } from "./mission";

export interface Player {
  username: string,
  cards: number[],
  points: number,
  trains: number,
  availableMissions: Mission[],
  missions: Mission[],
}