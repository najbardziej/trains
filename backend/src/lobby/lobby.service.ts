import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameRoomDto } from '../dto/game-room.dto';
import { GameRoom, GameRoomDocument } from 'src/schemas/game-room.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GameRoomEntity } from 'src/entities/game-room.entity';


@Injectable()
export class LobbyService {

  constructor(
    @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoomDocument>,
    @InjectModel(User.name)     private userModel:     Model<UserDocument>){}

  async findAll(): Promise<GameRoomEntity[]> {
    return Promise.all((await this.gameRoomModel.find().populate({ path: "players" }).exec())
      .map(async (gameRoom: GameRoomDocument) => <GameRoomEntity>{
        id: gameRoom.id,
        roomName: gameRoom.roomName,
        players: gameRoom.players.map(x => x.username),
      }));
  }

  async findOne(username: string): Promise<GameRoomEntity> {
    const user = await this.userModel.findOne({username: username});
    const gameRoom = await this.gameRoomModel.findOne({players: user}).populate({ path: "players" }).exec();
    if (!gameRoom) {
      return null;
    }
    const entity: GameRoomEntity = {
      id: gameRoom.id,
      roomName: gameRoom.roomName,
      players: gameRoom.players.map(x => x.username),
    }
    return entity;
  }

  async create(gameRoomDto: GameRoomDto, username:string) {
    const user = await this.userModel.findOne({username: username});

    if (await this.findOne(username))
      throw new ForbiddenException();

    return (new this.gameRoomModel({
      roomName: gameRoomDto.roomName,
      players: [ user ],
    })).save();
  }

  async leave(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id).populate({ path: "players" });
    if (gameRoom) {
      if (!gameRoom.players.some(x => x.username === username)) {
        throw new ForbiddenException()
      }
  
      const players = gameRoom.players.filter(x => x.username !== username);

      if (players.length == 0) {
        return this.gameRoomModel.deleteOne({_id: gameRoom});
      }
      return this.gameRoomModel.updateOne({_id: gameRoom}, {players: players});
    }
  }

  async join(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id);
    if (gameRoom.players.some(x => x.username === username)) {
      throw new ForbiddenException()
    }
    if (gameRoom.players.length == 5) {
      throw new ForbiddenException()
    }
    const user = await this.userModel.findOne({username: username});
    return this.gameRoomModel.updateOne({_id: gameRoom}, {players: [...gameRoom.players, user]});
  }

  async delete(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id).populate({ path: "players" });

    if (!gameRoom)
      throw new ForbiddenException()

    if (!gameRoom.players || gameRoom.players.length == 0) 
      return this.gameRoomModel.deleteOne({_id: gameRoom});

    if (gameRoom.players[0].username != username) 
      throw new ForbiddenException()

    return this.gameRoomModel.deleteOne({_id: gameRoom});
  }

  async start(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id).populate({ path: "players" });
    if (gameRoom.players[0].username !== username) {
      console.log(gameRoom.players[0].username, username)
      throw new ForbiddenException()
    }
    if (gameRoom.players.length == 1) {
      throw new ForbiddenException()
    }

    /// TODO: GAME START INITIALIZATION
  }
}
