import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    EventsModule,
    GamesModule,
    AuthModule,
    UsersModule,
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.CONNECTION_STRING,
        //useCreateIndex: true,
      })
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
