import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameMap, GameDocument } from 'src/schemas/game.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

import * as gameMapFile from './game-map.json';

@Injectable()
export class GameService {

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
  ){}

  private checkIfUserIsAllowed(game: Game, username: string) {
    if (!game) {
      throw new ForbiddenException();
    }
    if (!game.players.find(x => x.username == username)) {
      throw new ForbiddenException();
    }
  }

  private arrayShuffle(array: Array<any>) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  private reshufflePile(game: Game) {
    if (game.cardPile.length == 0) {
      game.cardPile = this.arrayShuffle(game.discardPile);
      game.discardPile = [];
    }
  }

  private fillAvailableCards(game: Game) {
    if (game.cardPile.length == 0 && game.discardPile.length == 0) {
      throw new ForbiddenException();
    }
    
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

  async getGameMap(id: string) {
    return (await this.gameModel.findOne({_id: id})).toObject().gameMap;
  }

  private createGameMap(): GameMap {
    const gameMap = {...gameMapFile};

    gameMap.edges.sort((e1, e2) => e2.length - e1.length);

    gameMap.edges.forEach(edge => {
      const quantities = []
      
      for (let i = 0; i < 10; i++) {
        quantities.push(
          gameMap.edges
            .filter(edge => edge['color'] == i)
            .map(edge => edge.length)
            .reduce((a, b) => a + b, 0)
        )
      }

      const min = Math.min(...quantities);
      const minElements = [];
      quantities.forEach((quantity, index) => {
        if (quantity == min) {
          minElements.push(index);
        }
      });

      edge['color'] = minElements[Math.floor(Math.random() * minElements.length)];
    });

    gameMap.edges.forEach(edge => {
      if (edge['color'] == 0) {
        edge['color'] = 9;
      }
    })

    return gameMap;
  }

  async getGame(id: string, username: string): Promise<Game> {
    const game = await this.gameModel.findOne({ _id: id }).exec();
    this.checkIfUserIsAllowed(game, username);
    return game.toObject({ virtuals: true });
  }

  async createGame(players: string[]) {
    const JOKER_COUNT = 14;
    const COMMON_CARD_COUNT = 12;

    let game: Game = {
      players: this.arrayShuffle(players.map(x => ({ 
        username: x,
        trains: 40,
        cards: [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        missions: [],
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
      discardPile: [],
      gameMap: this.createGameMap(),
    }

    // map.nodes.forEach((node) => {
    //   graph[node.id] = {}
    //   map.edges.forEach(edge =>{
    //       if (edge.nodes.some(n => n == node.id)) {
    //           let otherId = edge.nodes.filter(x => x != node.id)[0]
    //           graph[node.id][otherId] = edge.length;
    //       }
    //   })
    // }) 

    this.fillAvailableCards(game);

    return (new this.gameModel(game)).save();
  }

  async buyRoute(id: string, username: string, route: any) {
    const game = await this.gameModel.findOne({ _id: id }).exec();
    this.checkIfUserIsAllowed(game, username);

    const player = game.players.find(x => x.username == username);
    const savedRoute: any = game.gameMap.edges.find((edge: any) => edge.id == route.id);

    if (savedRoute.owner) 
      throw new ForbiddenException();

    if (savedRoute.color !== route.color && savedRoute.color !== 9) 
      throw new ForbiddenException();

    if (player.cards[savedRoute.color] + player.cards[0] < savedRoute.length)
      throw new ForbiddenException();

      for (let cost = savedRoute.length; cost > 0; cost--) {
        if (player.cards[route.color]) {
          player.cards[route.color] -= 1;
          game.discardPile.push(route.color);
        } else {
          player.cards[0] -= 1;
          game.discardPile.push(0);
        }
      }

    if (player.cards[0] < 0)
      throw new ForbiddenException();

    savedRoute.owner = game.players.findIndex(x => x.username == username);

    return (new this.gameModel(game)).save();
  }

  async drawCard(id: string, username: string, index: number) {
    const game = await this.gameModel.findOne({ _id: id }).exec();
    this.checkIfUserIsAllowed(game, username);
    if (index > 4 || index < -1) {
      throw new ForbiddenException();
    }
    let newCard;
    this.reshufflePile(game);
    if (index == -1) {
      newCard = game.cardPile.shift();
    }
    else {
      const replacementCard = game.cardPile.shift();
      newCard = game.availableCards.splice(index, 1, replacementCard)[0];
    }
    game.players.find(x => x.username == username).cards[newCard]++;
    this.fillAvailableCards(game);
    return (new this.gameModel(game)).save();
  }
}
