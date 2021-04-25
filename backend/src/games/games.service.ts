import { Injectable } from '@nestjs/common';
import { GameDto } from '../dto/game.dto';
//import { Games } from '../games';


@Injectable()
export class GamesService {
  private readonly games: GameDto[] = []

  findAll(): GameDto[] {
    return this.games;
  }

  create(newGame: GameDto) {
    const id = Date.now(); //TODO: change
    this.games[id] = { ...newGame, id }
  }

  find(id: number): GameDto {
    const game: GameDto = this.games[id];
    if (!game) throw new Error('No games found.');

    return game;
  }

  update(game: GameDto) {
    if (!this.games[game.id]) throw new Error('No game found.');

    this.games[game.id] = game;
  }

  delete(id: number) {
    const game: GameDto = this.games[id];
    if (!game) throw new Error('No game found.')
  }
}
