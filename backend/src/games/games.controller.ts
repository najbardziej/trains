import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import {  } from '../dto/game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameDto } from 'src/dto/game.dto';
import { GameRoomEntity } from 'src/entities/game-room.entity';
import { Schema } from 'mongoose';
import { EventsGateway } from 'src/events/events.gateway';
import { ModuleRef } from '@nestjs/core';
import { Inject, forwardRef } from '@nestjs/common'

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

  // @Get(':id')
  // async find(@Param('id') id: number): Promise<GameDto> {
  //   return this.gamesService.find(id);
  // }

  @Post()
  async create(@Body() gameDto: GameDto, @Req() req) {
    await this.gamesService.create(gameDto, req.user.username);
    this.eventsGateway.emitGameRooms(
      await this.gamesService.findAll()
    );
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

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    await this.gamesService.delete(id, req.user.username);
    this.eventsGateway.emitGameRooms(
      await this.gamesService.findAll()
    );
  }
}
