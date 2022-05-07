import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameRoomDto } from '../dto/game-room.dto';
import { GameRoom, GameRoomDocument } from 'src/schemas/game-room.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GameService } from 'src/game/game.service';


@Injectable()
export class LobbyService {

  constructor(
    @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoomDocument>,
    @InjectModel(User.name)     private userModel:     Model<UserDocument>,
    private readonly gameService: GameService){}

  async findAll(): Promise<GameRoom[]> {
    return (await this.gameRoomModel.find()).map(x => x.toObject({ virtuals: true }));
  }

  async findOne(username: string): Promise<GameRoomDocument> {
    const user = await this.userModel.findOne({username: username});
    const gameRoom = await this.gameRoomModel.findOne({players: user.username});
    if (!gameRoom) {
      return null;
    }
    return gameRoom;
  }

  async create(gameRoomDto: GameRoomDto, username:string) {
    const user = await this.userModel.findOne({username: username});

    if (await this.findOne(username))
      throw new ForbiddenException();

    return (new this.gameRoomModel({
      roomName: gameRoomDto.roomName,
      players: [ user.username ],
    })).save();
  }

  async leave(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id);
    if (gameRoom) {
      if (!gameRoom.players.some(x => x === username)) {
        throw new ForbiddenException()
      }
  
      const players = gameRoom.players.filter(x => x !== username);

      if (players.length == 0) {
        return this.gameRoomModel.deleteOne({_id: gameRoom});
      }
      return this.gameRoomModel.updateOne({_id: gameRoom}, {players: players});
    }
  }

  async join(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id);
    if (gameRoom.players.some(x => x === username)) {
      throw new ForbiddenException()
    }
    if (gameRoom.players.length == 5) {
      throw new ForbiddenException()
    }
    const user = await this.userModel.findOne({username: username});
    return this.gameRoomModel.updateOne({_id: gameRoom}, {players: [...gameRoom.players, user.username]});
  }

  async delete(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id);

    if (!gameRoom)
      throw new ForbiddenException()

    if (!gameRoom.players || gameRoom.players.length == 0) 
      return this.gameRoomModel.deleteOne({_id: gameRoom});

    if (gameRoom.players[0] != username) 
      throw new ForbiddenException()

    return this.gameRoomModel.deleteOne({_id: gameRoom});
  }

  async start(id: string, username: string) {
    const gameRoom = await this.gameRoomModel.findById(id);
    if (gameRoom.players[0] !== username) {
      throw new ForbiddenException()
    }
    if (gameRoom.players.length == 1) {
      throw new ForbiddenException()
    }

    let game = await this.gameService.create(gameRoom.players);

    return game.id;
  }
}
