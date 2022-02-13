import { Module } from '@nestjs/common';
import { GamesModule } from 'src/games/games.module';
import { EventsGateway } from './events.gateway';
import { forwardRef } from '@nestjs/common'

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
  imports: [forwardRef(() => GamesModule)],
})
export class EventsModule {}