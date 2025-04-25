import {Character} from "../entity/character.entity";
import {CreateCharacterDto} from "../dto/create-character.dto";

export interface ICharacterRepository {
    findAndPaginate(offset: number, limit: number);
    findById(id: number): Promise<Character | null>;
    create(char: Character): Promise<Character>;
    update(char: Character): Promise<Character>;
    delete(character: Character): Promise<void>;
}