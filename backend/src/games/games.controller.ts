import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import {  } from '../dto/game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameDto } from 'src/dto/game.dto';
import { GameRoomEntity } from 'src/entities/game-room.entity';
import { Schema } from 'mongoose';
import { EventsGateway } from 'src/events/events.gateway';

@ApiTags('games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService, 
    private readonly eventsGateway: EventsGateway) { }

  @Get()
  async index(): Promise<GameRoomEntity[]> {
    return this.gamesService.findAll();
  }

  // @Get(':id')
  // async find(@Param('id') id: number): Promise<GameDto> {
  //   return this.gamesService.find(id);
  // }

  @Post()
  async create(@Body() gameDto: GameDto, @Req() req) {
    await this.gamesService.create(gameDto, req.user.username);
    await this.eventsGateway.emitGameRooms(
      await this.gamesService.findAll()
    );
  }

  // @Put()
  // async join(@Body() gameDto: GameDto, @Req() req) {
  //   this.gamesService.join(gameDto);
  // }

  @Delete(':id')
  async delete(@Param('id') id: Schema.Types.ObjectId, @Req() req) {
    this.gamesService.delete(id, req.user);
  }
}
