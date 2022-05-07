import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from 'src/schemas/game.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GameEntity } from '../entities/game.entity';

@Injectable()
export class GameService {

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ){}

  private arrayShuffle(array: Array<any>) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  async getForUser(id: string, username: string): Promise<GameEntity> {
    //const user = await this.userModel.findOne({username: username});
    const game = await this.gameModel.findOne({ _id: id }).exec();
    if (!game) {
      return null;
    }
    const entity: GameEntity = {
      id: game.id,
      players: game.players.map(x => x.username),
      currentPlayer: game.currentPlayer,
      cardPile: game.cardPile,
      availableCards: game.availableCards,
      discardPile: game.discardPile
    }
    return entity;
  }

  async create(players: string[]) {

    const JOKER_COUNT = 14;
    const COMMON_CARD_COUNT = 12;

    let game: Game = {
      players: this.arrayShuffle(players.map(x => ({ username: x }) )),
      currentPlayer: 0,
      cardPile: this.arrayShuffle([
        ...Array(JOKER_COUNT).fill(0),
        ...Array(COMMON_CARD_COUNT).fill(1),
        ...Array(COMMON_CARD_COUNT).fill(2),
        ...Array(COMMON_CARD_COUNT).fill(3),
        ...Array(COMMON_CARD_COUNT).fill(4),
        ...Array(COMMON_CARD_COUNT).fill(5),
        ...Array(COMMON_CARD_COUNT).fill(6),
        ...Array(COMMON_CARD_COUNT).fill(7),
        ...Array(COMMON_CARD_COUNT).fill(8)
      ]),
      availableCards: [],
      discardPile: []
    }

    this.fillAvailableCards(game);

    return (new this.gameModel(game)).save();
  }

   reshufflePile(game: Game) {
    if (game.cardPile.length == 0) {
      game.cardPile = this.arrayShuffle(game.discardPile);
      game.discardPile = [];
    }
  }

  fillAvailableCards(game: Game) {
    while (game.availableCards.length < 5) {
      this.reshufflePile(game);
      game.availableCards.push(game.cardPile.pop());
    }

    while (game.availableCards.filter(x => x == 0).length >= 3) {
      while (game.availableCards.length) {
        game.discardPile.push(game.availableCards.pop());
      }
      while (game.availableCards.length < 5) {
        this.reshufflePile(game);
        game.availableCards.push(game.cardPile.pop());
      }
    }
  }

}