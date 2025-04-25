import {Episode} from "../entity/episode.entity";
import {CreateEpisodeDto} from "../dto/create-episode.dto";
import {Collection} from "@mikro-orm/core";
import {Loaded} from "@mikro-orm/postgresql";

export interface IEpisodeRepository {
    findManyByNames(names: string[]): Promise<Episode[]>;
    create(dto: CreateEpisodeDto): Promise<Episode>;
}