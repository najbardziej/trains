import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameMap, GameMapDocument } from 'src/schemas/game-map.schema';

import * as gameMap from './game-map.json';

@Injectable()
export class GameMapService {

  constructor(
    @InjectModel(GameMap.name) private readonly gameMapModel: Model<GameMapDocument>,
  ) {}

  async get(gameId: string) {
    return (await this.gameMapModel.findOne({gameId: gameId})).toObject();
  }

  create(gameId: string) {
    const map = {...gameMap, gameId: gameId};

    map.edges.sort(edge => -edge.length);

    map.edges.forEach(edge => {
      const quantities = []
      
      for (let i = 0; i < 10; i++) {
        quantities.push(
          map.edges
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

      var color = minElements[Math.floor(Math.random() * minElements.length)];
      edge['color'] = color;
    });

    map.edges.forEach(edge => {
      if (edge['color'] == 0) {
        edge['color'] = 9;
      }
    })

    return (new this.gameMapModel(map)).save();
  }
}
