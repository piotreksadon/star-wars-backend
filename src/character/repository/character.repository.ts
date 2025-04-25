import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Character } from '../entity/character.entity';
import { ICharacterRepository } from "./character-repository.port";
import { PaginationMetadata } from "../../shared/interfaces/pagination.interface";

export interface CharacterQueryConditions {
    id?: number;
    name?: string;
    planet?: string;
}

export interface CharactersPaginatedResult<T> {
    characters: T[];
    metadata: PaginationMetadata;
}

@Injectable()
export class CharacterRepository extends ICharacterRepository {
    constructor(
        private readonly em: EntityManager,
    ) {
        super()
    }

    //I was thinking of extracting this method to some BaseRepository class to use it in different modules if needed,
    //but passed on this idea not to overcomplicate this simple app.
    async findAndPaginate(page: number, limit: number): Promise<CharactersPaginatedResult<Character>> {
        const count = await this.em.count(Character, {});
        const totalPages = Math.ceil(count / limit);

        const validPage = page > totalPages ? null : Math.max(1, page);
        if (!validPage) {
            return {
                characters: [],
                metadata: {
                    totalRecords: count,
                    currentPage: null,
                    totalPages,
                    limit,
                    prevPage: totalPages > 0 ? totalPages : null,
                    nextPage: null
                }
            };
        }

        const offset = (validPage - 1) * limit;
        const result = await this.em.find(Character, {}, {
            orderBy: { id: 'ASC' },
            limit,
            offset
        });


        //I decided to make pagination a bit more complicated and add detailed metadata in response to achieve
        // easier frontend development.
        return {
            characters: result,
            metadata: {
                totalRecords: count,
                currentPage: validPage,
                totalPages,
                limit,
                prevPage: validPage > 1 ? validPage - 1 : null,
                nextPage: validPage < totalPages ? validPage + 1 : null
            }
        };
    }

    async findOneBy(conditions: CharacterQueryConditions): Promise<Character | null> {
        return this.em.findOne(Character, conditions, {populate: ['episodes']});
    }

    async create(char: Character): Promise<Character> {
        if (char.episodes?.isInitialized() === false) {
            await char.episodes.init();
        }

        const character = this.em.create(Character, char);
        await this.em.persistAndFlush(character);
        return character;
    }

    async update(character: Character): Promise<Character> {
        await this.em.flush();
        return character;
    }

    async delete(character: Character): Promise<void> {
        await this.em.removeAndFlush(character);
    }
}
