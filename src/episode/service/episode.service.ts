import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateEpisodeDto } from "../dto/create-episode.dto";
import { Episode } from "../entity/episode.entity";
import { IEpisodeRepository } from "../repository/episode-repository.port";

@Injectable()
export class EpisodeService {
    constructor(
        @Inject()
        private readonly episodeRepo: IEpisodeRepository,
    ) {}

    async create(dto: CreateEpisodeDto): Promise<Episode> {
        const existingEpisode = await this.episodeRepo.findOneBy({ name: dto.name });

        if (existingEpisode) {
            throw new BadRequestException(`Episode ${dto.name} already exists`);
        }

        const episode = new Episode()
        episode.name = dto.name;
        return this.episodeRepo.create(episode);
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
