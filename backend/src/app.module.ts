import { Module } from '@nestjs/common';
import { LobbyModule } from './lobby/lobby.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    EventsModule,
    LobbyModule,
    AuthModule,
    UsersModule,
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.CONNECTION_STRING,
        //useCreateIndex: true,
      })
    }),
    GameModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
