import { Episode } from "../entity/episode.entity";
import { EpisodeQueryConditions } from "./episode.repository";


//I decided to use hexagonal ports and adapters so the application’s core logic remains independent,
//testable, and adaptable to change, while infrastructure details are handled separately through adapters.
//While I could omit this architectural feature in a simple app, in a real-world project I'd first discuss whether it's
//necessary or not.
export abstract class IEpisodeRepository {
    abstract findManyByNames(names: string[]): Promise<Episode[]>;
    abstract create(Episode): Promise<Episode>;
    abstract findOneBy(conditions: EpisodeQueryConditions): Promise<Episode| null>
}