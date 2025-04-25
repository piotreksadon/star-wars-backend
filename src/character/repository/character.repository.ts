import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Character } from '../entity/character.entity';
import {ICharacterRepository} from "./character-repository.interface";
import {Episode} from "../../episode/entity/episode.entity";

@Injectable()
export class CharacterRepository implements ICharacterRepository {
    constructor(
        private readonly em: EntityManager,
    ) {}

    async findAndPaginate(page: number, limit: number) {
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

    async findById(id: number): Promise<Character | null> {
        return this.em.findOne(Character, { id }, { populate: ['episodes'] });
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

    private getPage(totalRecords: number, page: number, limit: number): number {
        if (!totalRecords) return 0;
        const totalPages = Math.ceil(totalRecords / limit);
        return Math.max(1, Math.min(page, totalPages));
    }
}
