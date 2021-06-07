import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { GameDto } from '../dto/game.dto';
import { Game, GameDocument } from 'src/schemas/game.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GameEntity } from 'src/entities/game.entity';


@Injectable()
export class GamesService {

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>){}

  async findAll(): Promise<any> { //GameEntity[]
    return await Promise.all((await this.gameModel.find().exec())
      .map(async (game) => <GameEntity>{
        roomName: game.roomName,
        player1: (await this.userModel.findById(game.player1))?.username,
        player2: (await this.userModel.findById(game.player2))?.username,
        player3: (await this.userModel.findById(game.player3))?.username,
        player4: (await this.userModel.findById(game.player4))?.username,
        player5: (await this.userModel.findById(game.player5))?.username,
      }));
  }

  async create(gameDto: GameDto, username:string) {
    const user = await this.userModel.findOne({username: username});

    return (new this.gameModel({
      roomName: gameDto.roomName,
      player1: user,
      player2: null,
      player3: null,
      player4: null,
      player5: null,
      
    })).save();
  }

  // async find(id: number): GameDocument {
  //   const game: GameDto = this.games[id];
  //   if (!game) throw new Error('No games found.');

  //   return game;
  // }

  // async join(game: GameDto, username: string) {

  //   if (!this.games[game.id]) throw new Error('No game found.');

  //   this.games[game.id] = game;
  // }

  async delete(id: Schema.Types.ObjectId, username: string) {
    const game = await this.gameModel.findById(id);
    if (game.player1.username != username) 
      throw new ForbiddenException()

    return this.gameModel.deleteOne({_id :game});
  }
}
