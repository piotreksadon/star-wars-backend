import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { CharacterModule } from './character/character.module';
import mikroOrmConfig from '../mikro-orm.config';
import {EpisodeModule} from "./episode/episode.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    CharacterModule,
    EpisodeModule,
  ],
})
export class AppModule {}