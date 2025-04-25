import {Character} from "../entity/character.entity";
import {CharacterQueryConditions, CharactersPaginatedResult} from "./character.repository";

//I decided to use hexagonal ports and adapters so the application’s core logic remains independent,
//testable, and adaptable to change, while infrastructure details are handled separately through adapters.
//While I could omit this architectural feature in a simple app, in a real-world project I'd first discuss whether it's
//necessary or not.
export abstract class ICharacterRepository {
    abstract findAndPaginate(offset: number, limit: number): Promise<CharactersPaginatedResult<Character>>;
    abstract findOneBy(conditions: CharacterQueryConditions): Promise<Character| null>
    abstract create(char: Character): Promise<Character>;
    abstract update(char: Character): Promise<Character>;
    abstract delete(character: Character): Promise<void>;
}