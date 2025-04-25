import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';
import { Character } from '../entity/character.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import {Collection, EntityRepository} from '@mikro-orm/core';
import {ICharacterRepository} from "../repository/character-repository.interface";
import {Episode} from "../../episode/entity/episode.entity";
import {CharacterRepository} from "../repository/character.repository";
import {EpisodeService} from "../../episode/service/episode.service";

@Injectable()
export class CharacterService {
    constructor(
        @Inject()
        private readonly characterRepo: CharacterRepository,
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

    async findAndPaginate(offset = 0, limit = 10) {
        return this.characterRepo.findAndPaginate(offset, limit);
    }

    async findById(id: number): Promise<Character> {
        const character = await this.characterRepo.findById(id);
        if (!character) throw new NotFoundException('Character not found');
        return character;
    }

    async update(id: number, dto: UpdateCharacterDto): Promise<Character> {
        const character = await this.characterRepo.findById(id);
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
        const character = await this.characterRepo.findById(id);

        if (!character) {
            throw new NotFoundException()
        }

        await this.characterRepo.delete(character)
    }
}
