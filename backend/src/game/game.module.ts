import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from 'src/events/events.module';
import { Game, GameSchema } from 'src/schemas/game.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameMapService } from './game-map/game-map.service';
import { GameMapController } from './game-map/game-map.controller';
import { GameMap, GameMapSchema } from 'src/schemas/game-map.schema';

@Module({
  imports: [
    UsersModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema},
      { name: User.name, schema: UserSchema},
      { name: GameMap.name, schema: GameMapSchema},
    ])
  ],
  controllers: [GameController, GameMapController],
  providers: [GameService, GameMapService],
  exports: [GameService, GameMapService]
})
export class GameModule {}
