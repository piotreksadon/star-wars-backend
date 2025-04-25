import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Character } from './entity/character.entity';
import { CharacterService } from './service/character.service';
import { CharacterController } from './controller/character.controller';
import {CharacterRepository} from "./repository/character.repository";
import {EpisodeModule} from "../episode/episode.module";
import {EpisodeService} from "../episode/service/episode.service";

@Module({
    imports: [MikroOrmModule.forFeature([Character]), EpisodeModule],
    controllers: [CharacterController],
    providers: [CharacterService, CharacterRepository],
})
export class CharacterModule {}