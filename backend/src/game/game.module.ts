import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from 'src/events/events.module';
import { Game, GameSchema } from 'src/schemas/game.schema';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    UsersModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema},
    ])
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
