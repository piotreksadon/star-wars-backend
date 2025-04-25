import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Character } from './entity/character.entity';
import { CharacterService } from './service/character.service';
import { CharacterController } from './controller/character.controller';
import { CharacterRepository } from "./repository/character.repository";
import { ICharacterRepository } from "./repository/character-repository.port";
import { EpisodeModule } from "../episode/episode.module";

@Module({
    imports: [MikroOrmModule.forFeature([Character]), EpisodeModule],
    controllers: [CharacterController],
    providers: [
        CharacterService,
        {
            provide: ICharacterRepository,
            useClass: CharacterRepository,
        }
    ],
})
export class CharacterModule {}