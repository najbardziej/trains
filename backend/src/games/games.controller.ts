import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import {  } from '../dto/game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameDto } from 'src/dto/game.dto';
import { GameEntity } from 'src/entities/game.entity';
import { Schema } from 'mongoose';

@ApiTags('games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Get()
  async index(): Promise<GameEntity[]> {
    return this.gamesService.findAll();
  }

  // @Get(':id')
  // async find(@Param('id') id: number): Promise<GameDto> {
  //   return this.gamesService.find(id);
  // }

  @Post()
  async create(@Body() gameDto: GameDto, @Req() req) {
    this.gamesService.create(gameDto, req.user);
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
