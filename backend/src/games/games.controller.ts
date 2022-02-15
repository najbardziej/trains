import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import {  } from '../dto/game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameDto } from 'src/dto/game.dto';
import { GameRoomEntity } from 'src/entities/game-room.entity';
import { Schema, UpdateWriteOpResult } from 'mongoose';
import { EventsGateway } from 'src/events/events.gateway';
import { ModuleRef } from '@nestjs/core';
import { Inject, forwardRef } from '@nestjs/common'
import { GameStateEntity } from 'src/entities/game-state.entity';

@ApiTags('games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {

  constructor(
    private readonly gamesService: GamesService, 
    private readonly eventsGateway: EventsGateway, 
    ) { }

  @Get()
  async index(): Promise<GameRoomEntity[]> {
    return this.gamesService.findAll();
  }

  @Post()
  async create(@Body() gameDto: GameDto, @Req() req): Promise<GameRoomEntity> {
    let game = await this.gamesService.create(gameDto, req.user.username);
    this.eventsGateway.emitGameRooms(
      await this.gamesService.findAll()
    );
    return <GameRoomEntity>{
      id: game.id,
      roomName: game.roomName,
      players: game.players.map(x => x.username),
    };
  }

  @Put("/join/:id")
  async join(@Param('id') id: string, @Req() req) {
    await this.gamesService.join(id, req.user.username);
    this.eventsGateway.emitGameRooms(
      await this.gamesService.findAll()
    );
  }

  @Put("/leave/:id")
  async leave(@Param('id') id: string, @Req() req) {
    await this.gamesService.leave(id, req.user.username);
    this.eventsGateway.emitGameRooms(
      await this.gamesService.findAll()
    );
  }

  @Put("/start/:id")
  async start(@Param('id') id: string, @Req() req) {
    await this.gamesService.start(id, req.user.username);
    this.eventsGateway.emitGameState(<GameStateEntity>{ id: id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    await this.gamesService.delete(id, req.user.username);
    this.eventsGateway.emitGameRooms(
      await this.gamesService.findAll()
    );
  }
}
