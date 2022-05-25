import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from 'src/schemas/game.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class GameService {

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>
  ){}

  private arrayShuffle(array: Array<any>) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  async getForUser(id: string, username: string): Promise<Game> {
    const game = await this.gameModel.findOne({ _id: id }).exec();
    if (!game) {
      return null;
    }
    if (!game.players.find(x => x.username == username)) {
      throw new ForbiddenException();
    }
    return game.toObject({ virtuals: true });
  }

  async create(players: string[]) {

    const JOKER_COUNT = 14;
    const COMMON_CARD_COUNT = 12;

    let game: Game = {
      players: this.arrayShuffle(players.map(x => ({ 
        username: x,
        trains: 40,
        cards: [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      }))),
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

  private reshufflePile(game: Game) {
    if (game.cardPile.length == 0) {
      game.cardPile = this.arrayShuffle(game.discardPile);
      game.discardPile = [];
    }
  }

  private fillAvailableCards(game: Game) {
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

  async drawCard(id: string, username: string, index: number) {
    const game = await this.gameModel.findOne({ _id: id }).exec();
    if (!game) {
      return null;
    }
    if (!game.players.find(x => x.username == username)) {
      throw new ForbiddenException();
    }
    if (index > 4 || index < -1) {
      throw new ForbiddenException();
    }
    let newCard;
    if (index == -1) {
      this.reshufflePile(game);
      newCard = game.cardPile.shift();
    }
    else {
      this.reshufflePile(game);
      const replacementCard = game.cardPile.shift();
      newCard = game.availableCards.splice(index, 1, replacementCard)[0];
    }
    game.players.find(x => x.username == username).cards[newCard]++;
    this.fillAvailableCards(game);
    return (new this.gameModel(game)).save();
  }

}
