import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
//import { Games } from '../games';
import { GameDto } from '../dto/game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('games')
@ApiBearerAuth()
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(): Promise<GameDto[]> {
    return this.gamesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async find(@Param('id') id: number): Promise<GameDto> {
    return this.gamesService.find(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() gameDto: GameDto) {
    this.gamesService.create(gameDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() gameDto: GameDto) {
    this.gamesService.update(gameDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    this.gamesService.delete(id);
  }
}
