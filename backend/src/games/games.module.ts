import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/schemas/game.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';
import { forwardRef } from '@nestjs/common'

@Module({
  imports: [
    forwardRef(() => EventsModule),
    UsersModule,
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema},
      { name: User.name, schema: UserSchema}
    ])
  ],
  providers: [GamesService],
  exports: [GamesService],
  controllers: [GamesController]
})
export class GamesModule { }
