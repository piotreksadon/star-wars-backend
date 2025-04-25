import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {CharacterRepository} from "../../character/repository/character.repository";
import {CreateEpisodeDto} from "../dto/create-episode.dto";
import {Episode} from "../entity/episode.entity";
import {EpisodeRepository} from "../repository/episode.repository";
import {Collection} from "@mikro-orm/core";


@Injectable()
export class EpisodeService {
    constructor(
        @Inject()
        private readonly episodeRepo: EpisodeRepository,
    ) {}

    async create(dto: CreateEpisodeDto): Promise<Episode> {
        return this.episodeRepo.create(dto);
    }

    async findManyByNames(names: string[]): Promise<Episode[]> {
        const episodes = await this.episodeRepo.findManyByNames(names);
        if (!episodes.length) throw new NotFoundException('No episodes found');
        return episodes;
    }

    async validateAndFetchEpisodes(episodeNames: string[]): Promise<Episode[]> {
        const episodes = await this.findManyByNames(episodeNames);
        if (episodes.length !== episodeNames.length) {
            const foundNames = episodes.map(e => e.name);
            const missing = episodeNames.filter(name => !foundNames.includes(name));
            throw new NotFoundException(`Episodes not found: ${missing.join(', ')}`);
        }
        return episodes;
    }
}
