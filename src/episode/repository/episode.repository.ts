import { Injectable} from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Episode } from "../entity/episode.entity";
import { IEpisodeRepository } from "./episode-repository.port";

export interface EpisodeQueryConditions {
    id?: number;
    name?: string;
}
@Injectable()
export class EpisodeRepository extends IEpisodeRepository {
    constructor(
        private readonly em: EntityManager,
    ) {
        super()
    }

    async findManyByNames(names: string[]): Promise<Episode[]> {
        return this.em.find(Episode, { name: { $in: names } });
    }

    async create(episode: Episode): Promise<Episode> {
        await this.em.persistAndFlush(episode);
        return episode
    }

    async findOneBy(conditions: EpisodeQueryConditions): Promise<Episode | null> {
        return this.em.findOne(Episode, conditions);
    }
}
