import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameDto } from '../dto/game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Get()
  async index(): Promise<GameDto[]> {
    return this.gamesService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: number): Promise<GameDto> {
    return this.gamesService.find(id);
  }

  @Post()
  async create(@Body() gameDto: GameDto) {
    this.gamesService.create(gameDto);
  }

  @Put()
  async update(@Body() gameDto: GameDto) {
    this.gamesService.update(gameDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    this.gamesService.delete(id);
  }
}
