import { Test, TestingModule } from '@nestjs/testing';
import { CharacterRepository } from './character.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Character } from '../entity/character.entity';
import { Collection } from '@mikro-orm/core';

describe('CharacterRepository', () => {
    let repo: CharacterRepository;
    let em: jest.Mocked<EntityManager>;

    const mockCharacter: Character = {
        id: 1,
        name: 'Luke',
        planet: 'Tatooine',
        episodes: new Collection<any>([]),
    } as unknown as Character;

    beforeEach(async () => {
        const mockEm = {
            count: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            persistAndFlush: jest.fn(),
            flush: jest.fn(),
            removeAndFlush: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CharacterRepository,
                { provide: EntityManager, useValue: mockEm },
            ],
        }).compile();

        repo = module.get(CharacterRepository);
        em = module.get(EntityManager);
    });

    afterEach(() => jest.clearAllMocks());

    describe('findAndPaginate', () => {
        it('should return paginated results when valid page', async () => {
            em.count.mockResolvedValue(10);
            em.find.mockResolvedValue([mockCharacter]);

            const result = await repo.findAndPaginate(1, 5);

            expect(em.count).toHaveBeenCalledWith(Character, {});
            expect(em.find).toHaveBeenCalledWith(Character, {}, {
                orderBy: { id: 'ASC' },
                limit: 5,
                offset: 0,
            });

            expect(result).toEqual({
                characters: [mockCharacter],
                metadata: {
                    totalRecords: 10,
                    currentPage: 1,
                    totalPages: 2,
                    limit: 5,
                    prevPage: null,
                    nextPage: 2,
                },
            });
        });

        it('should return empty result when page is out of range', async () => {
            em.count.mockResolvedValue(10);
            const result = await repo.findAndPaginate(5, 5); // totalPages = 2

            expect(result.characters).toEqual([]);
            expect(result.metadata).toMatchObject({
                currentPage: null,
                totalPages: 2,
                nextPage: null,
            });
        });
    });

    describe('findOneBy', () => {
        it('should return character with populated episodes', async () => {
            em.findOne.mockResolvedValue(mockCharacter);
            const result = await repo.findOneBy({id:1});
            expect(em.findOne).toHaveBeenCalledWith(Character, { id: 1 }, { populate: ['episodes'] });
            expect(result).toBe(mockCharacter);
        });
    });

    describe('create', () => {
        it('should create and persist a character', async () => {
            const inputCharacter = {
                ...mockCharacter,
                episodes: {
                    isInitialized: () => true,
                },
            } as unknown as Character;

            em.create.mockReturnValue(inputCharacter);
            await repo.create(inputCharacter);

            expect(em.create).toHaveBeenCalledWith(Character, inputCharacter);
            expect(em.persistAndFlush).toHaveBeenCalledWith(inputCharacter);
        });

        it('should initialize episodes if not initialized', async () => {
            const inputCharacter = {
                ...mockCharacter,
                episodes: {
                    isInitialized: () => false,
                    init: jest.fn(),
                },
            } as unknown as Character;

            await repo.create(inputCharacter);
            expect(inputCharacter.episodes.init).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should flush and return the character', async () => {
            await repo.update(mockCharacter);
            expect(em.flush).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should remove and flush the character', async () => {
            await repo.delete(mockCharacter);
            expect(em.removeAndFlush).toHaveBeenCalledWith(mockCharacter);
        });
    });
});
