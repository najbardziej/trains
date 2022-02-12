import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { GameDto } from '../dto/game.dto';
import { Game, GameDocument } from 'src/schemas/game.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GameRoomEntity } from 'src/entities/game-room.entity';


@Injectable()
export class GamesService {

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>){}

  async findAll(): Promise<GameRoomEntity[]> {
    return await Promise.all((await this.gameModel.find().populate({ path: "players"}).exec())
      .map(async (game: GameDocument) => <GameRoomEntity>{
        id: game.id,
        roomName: game.roomName,
        players: game.players.map(x => x.username),
      }));
  }

  async create(gameDto: GameDto, username:string) {
    const user = await this.userModel.findOne({username: username});

    return (new this.gameModel({
      roomName: gameDto.roomName,
      players: [ user ],
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
    if (game.players[0].username != username) 
      throw new ForbiddenException()

    return this.gameModel.deleteOne({_id :game});
  }
}
