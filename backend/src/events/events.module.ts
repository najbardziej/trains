import { Module } from '@nestjs/common';
import { LobbyModule } from 'src/lobby/lobby.module';
import { EventsGateway } from './events.gateway';
import { forwardRef } from '@nestjs/common'

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
  imports: [forwardRef(() => LobbyModule)],
})
export class EventsModule {}