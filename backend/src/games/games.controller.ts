import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { Games } from '../games';
import { Game } from '../game';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(): Promise<Games> {
    return this.gamesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async find(@Param('id') id: number): Promise<Game> {
    return this.gamesService.find(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() game: Game) {
    this.gamesService.create(game);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() game: Game) {
    this.gamesService.update(game);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    this.gamesService.delete(id);
  }
}
