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
    return Promise.all((await this.gameModel.find().populate({ path: "players" }).exec())
      .map(async (game: GameDocument) => <GameRoomEntity>{
        id: game.id,
        roomName: game.roomName,
        players: game.players.map(x => x.username),
      }));
  }

  async findOne(username: string): Promise<GameRoomEntity> {
    const user = await this.userModel.findOne({username: username});
    const game = await this.gameModel.findOne({players: user}).populate({ path: "players" }).exec();
    if (!game) {
      return null;
    }
    const entity: GameRoomEntity = {
      id: game.id,
      roomName: game.roomName,
      players: game.players.map(x => x.username),
    }
    return entity;
  }

  async create(gameDto: GameDto, username:string) {
    const user = await this.userModel.findOne({username: username});

    return (new this.gameModel({
      roomName: gameDto.roomName,
      players: [ user ],
    })).save();
  }

  async leave(id: string, username: string) {
    const game = await this.gameModel.findById(id).populate({ path: "players" });
    if (game) {
      if (!game.players.some(x => x.username === username)) {
        throw new ForbiddenException()
      }
  
      const players = game.players.filter(x => x.username !== username);

      if (players.length == 0) {
        return this.gameModel.deleteOne({_id: game});
      }
      return this.gameModel.updateOne({_id: game}, {players: players});
    }
  }

  async join(id: string, username: string) {
    const game = await this.gameModel.findById(id);
    if (game.players.some(x => x.username === username)) {
      throw new ForbiddenException()
    }
    if (game.players.length == 5) {
      throw new ForbiddenException()
    }
    const user = await this.userModel.findOne({username: username});
    return this.gameModel.updateOne({_id: game}, {players: [...game.players, user]});
  }

  async delete(id: string, username: string) {
    const game = await this.gameModel.findById(id).populate({ path: "players" });

    if (!game.players || game.players.length == 0) 
      return this.gameModel.deleteOne({_id: game});

    if (game.players[0].username != username) 
      throw new ForbiddenException()

    return this.gameModel.deleteOne({_id: game});
  }

  async start(id: string, username: string) {
    const game = await this.gameModel.findById(id).populate({ path: "players" });
    if (game.players[0].username !== username) {
      console.log(game.players[0].username, username)
      throw new ForbiddenException()
    }
    if (game.players.length == 1) {
      throw new ForbiddenException()
    }

    /// TODO: GAME START INITIALIZATION
  }
}
