import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameRoom, GameRoomSchema } from 'src/schemas/game-room.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';
import { forwardRef } from '@nestjs/common'
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    forwardRef(() => EventsModule),
    UsersModule,
    GameModule,
    MongooseModule.forFeature([
      { name: GameRoom.name, schema: GameRoomSchema},
      { name: User.name,     schema: UserSchema}
    ])
  ],
  providers: [LobbyService],
  exports: [LobbyService],
  controllers: [LobbyController]
})
export class LobbyModule { }
