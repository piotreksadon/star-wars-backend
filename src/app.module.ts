import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { CharacterModule } from './character/character.module';
import mikroOrmConfig from '../mikro-orm.config';
import {EpisodeModule} from "./episode/episode.module";
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(3000),
        DB_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_DEBUG: Joi.boolean().required(),
      }),
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    CharacterModule,
    EpisodeModule,
  ],
})
export class AppModule {}