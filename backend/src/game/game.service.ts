import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameMap, GameDocument, Missions } from 'src/schemas/game.schema';
import * as Graph from 'node-dijkstra';

import * as gameMapFile from './game-map.json';
import { COLOR, FORCED_MOVE } from 'src/model/constants';

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
    if (game.cardPile.length == 0 && game.discardPile.length == 0)
      throw new ForbiddenException();
    
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

  private generateMissions(gameMap): Missions {
    const missions = {
      'main': [],
      'additional': []
    };

    const graph = {}
    gameMap.nodes.forEach((node) => {
      graph[node.id] = {}
      gameMap.edges.forEach(edge =>{
          if (edge.nodes.some(n => n == node.id)) {
              let otherId = edge.nodes.filter(x => x != node.id)[0]
              graph[node.id][otherId] = edge.length;
          }
      })
    })

    const route = new Graph(graph);
    let id = 0;

    const nodesForMain = this.arrayShuffle(gameMap.nodes.map(node => node.id.toString()));
    while (missions.main.length < 5) {
      let node1 = nodesForMain.pop();
      for (let node2 of nodesForMain) {
        const path = route.path(node1, node2, { cost: true }); 
        if (path.cost >= 18 && path.cost <= 20) {
          missions.main.push({
            nodes: [node1, node2],
            points: path.cost,
            id: id++,
          });

          nodesForMain.splice(nodesForMain.indexOf(node2), 1);
          break;
        }
      }
    }

    const nodesForAdditional = this.arrayShuffle(gameMap.nodes.map(node => node.id.toString()).flatMap(n => [n,n]));
    while (missions.additional.length < 35) {
      let node1 = nodesForAdditional.pop();
      for (let node2 of nodesForAdditional) {
        const path = route.path(node1, node2, { cost: true }); 
        if (path.cost >= 4 && path.cost <= 12 && path.path.length > 2) {
          if (missions.additional.some(x => x.nodes.includes(node1) && x.nodes.includes(node2))) {
            continue;
          }
          missions.additional.push({
            nodes: [node1, node2],
            points: path.cost,
            id: id++,
          });

          nodesForAdditional.splice(nodesForAdditional.indexOf(node2), 1);
          break;
        }
      }
    }
    return missions;
  }

  async drawMissions(id: string, username: string) {
    const game = await this.gameModel.findOne({_id: id});
    this.checkIfUserIsAllowed(game, username);
    const player = game.players.find(x => x.username == username);
    
    if (player.availableMissions.length > 0)
      throw new ForbiddenException();

    if (game.missions.additional.length < 3)
      throw new ForbiddenException();

    const missions = game.missions.additional.splice(0, 3);
    player.availableMissions = missions;
    (new this.gameModel(game)).save();
  }

  async discardMission(id: string, username: string, missionId: number) {
    const game = await this.gameModel.findOne({_id: id});
    this.checkIfUserIsAllowed(game, username);
    const player = game.players.find(x => x.username == username);
    const missionIndex = player.availableMissions.findIndex(x => x.id == missionId);
    const mission = player.availableMissions.splice(missionIndex, 1)[0];
    // If mission is additional mission return it to pile
    if (mission.id >= 5) {
      game.missions.additional.push(mission);
    }
    if (player.availableMissions.length == 1) {
      this.acceptMissions(id, username);
    }
    (new this.gameModel(game)).save();
  }

  async acceptMissions(id: string, username: string) {
    const game = await this.gameModel.findOne({_id: id});
    this.checkIfUserIsAllowed(game, username);
    const player = game.players.find(x => x.username == username);
    player.missions = [...player.missions, ...player.availableMissions];
    player.availableMissions = [];
    (new this.gameModel(game)).save();
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

    const gameMap = this.createGameMap();
    const missions = this.generateMissions(gameMap);
    const game: Game = {
      players: this.arrayShuffle(players.map(x => ({ 
        username: x,
        trains: 40,
        cards: [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        missions: [missions.main.shift(), missions.additional.shift(), missions.additional.shift()],
      }))),
      currentPlayer: 0,
      forcedMove: FORCED_MOVE.DRAW_MISSION,
      cardPile: this.arrayShuffle([
        ...Array(JOKER_COUNT).fill(COLOR.JOKER),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.RED),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.BLUE),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.GREEN),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.YELLOW),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.PURPLE),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.ORANGE),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.WHITE),
        ...Array(COMMON_CARD_COUNT).fill(COLOR.BLACK)
      ]),
      availableCards: [],
      discardPile: [],
      gameMap: gameMap,
      missions: missions,
    }

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

    if (savedRoute.color !== route.color && savedRoute.color !== COLOR.GRAY) 
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

    player.trains -= savedRoute.length;
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
    game.markModified('players');
    return (new this.gameModel(game)).save();
  }
}
