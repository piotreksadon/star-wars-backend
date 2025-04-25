import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';
import { Character } from '../entity/character.entity';
import { ICharacterRepository } from "../repository/character-repository.port";
import { EpisodeService } from "../../episode/service/episode.service";
import {CharactersPaginatedResult} from "../repository/character.repository";

@Injectable()
export class CharacterService {
    constructor(
        @Inject()
        private readonly characterRepo: ICharacterRepository,
        @Inject()
        private readonly episodeService: EpisodeService,
    ) {}

    async create(dto: CreateCharacterDto): Promise<Character> {
        const episodes = await this.episodeService.validateAndFetchEpisodes(dto.episodes);

        const character = new Character();
        character.name = dto.name;
        character.episodes.set(episodes);

        if (dto.planet) {
            character.planet = dto.planet;
        }

        return this.characterRepo.create(character);
    }

    async findAndPaginate(offset = 0, limit = 10):Promise<CharactersPaginatedResult<Character>> {
        return this.characterRepo.findAndPaginate(offset, limit);
    }

    async findOne(id: number): Promise<Character> {
        const character = await this.characterRepo.findOneBy({id});
        if (!character) throw new NotFoundException('Character not found');
        return character;
    }

    async update(id: number, dto: UpdateCharacterDto): Promise<Character> {
        const character = await this.characterRepo.findOneBy({id});
        if (!character) throw new NotFoundException('Character not found');

        if (dto.name) character.name = dto.name;
        if (dto.planet !== undefined) character.planet = dto.planet;

        if (dto.episodes) {
            const episodes = await this.episodeService.validateAndFetchEpisodes(dto.episodes);

            character.episodes.set(episodes);
        }

        return this.characterRepo.update(character);
    }

    async remove(id: number): Promise<void> {
        const character = await this.characterRepo.findOneBy({id});

        if (!character) {
            throw new NotFoundException()
        }

        await this.characterRepo.delete(character)
    }
}
