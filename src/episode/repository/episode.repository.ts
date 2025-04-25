import {Injectable} from "@nestjs/common";
import {EntityManager, Loaded, PopulatePath} from "@mikro-orm/postgresql";
import {Episode} from "../entity/episode.entity";
import {CreateEpisodeDto} from "../dto/create-episode.dto";
import {IEpisodeRepository} from "./episode-repository.interface";
import {Collection} from "@mikro-orm/core";

@Injectable()
export class EpisodeRepository implements IEpisodeRepository {
    constructor(
        private readonly em: EntityManager,
    ) {}

    async findManyByNames(names: string[]): Promise<Episode[]> {
        return this.em.find(Episode, { name: { $in: names } });
    }

    async create(dto: CreateEpisodeDto) {
        const episode = this.em.create(Episode, {
            name: dto.name,
        });

        await this.em.persistAndFlush(episode);
        return episode
    }
}
