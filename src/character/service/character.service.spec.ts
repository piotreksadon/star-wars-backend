import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { CharacterRepository } from '../repository/character.repository';
import { EpisodeService } from '../../episode/service/episode.service';
import { NotFoundException } from '@nestjs/common';
import { Character } from '../entity/character.entity';
import { Episode } from '../../episode/entity/episode.entity';
import { ICharacterRepository } from "../repository/character-repository.port";

jest.mock('../entity/character.entity', () => {
    return {
        Character: jest.fn().mockImplementation(() => ({
            name: '',
            planet: '',
            episodes: {
                set: jest.fn(),
                getItems: jest.fn(),
            },
        })),
    };
});

describe('CharacterService', () => {
    let service: CharacterService;
    let characterRepo: jest.Mocked<CharacterRepository>;
    let episodeService: jest.Mocked<EpisodeService>;

    const mockEpisodes = [{ name: 'A New Hope' }] as Episode[];

    const mockCharacter = {
        id: 1,
        name: 'Luke',
        planet: 'Tatooine',
        episodes: {
            set: jest.fn(),
            getItems: () => mockEpisodes,
        },
    } as unknown as Character;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CharacterService,
                {
                    provide: ICharacterRepository,
                    useValue: {
                        create: jest.fn(),
                        findAndPaginate: jest.fn(),
                        findOneBy: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: EpisodeService,
                    useValue: {
                        validateAndFetchEpisodes: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CharacterService>(CharacterService);
        characterRepo = module.get(ICharacterRepository);
        episodeService = module.get(EpisodeService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('create', () => {
        it('should create a character', async () => {
            const dto = {
                name: 'Luke',
                planet: 'Tatooine',
                episodes: ['A New Hope'],
            };

            episodeService.validateAndFetchEpisodes.mockResolvedValue(mockEpisodes);
            characterRepo.create.mockImplementation(async (char: Character) => {
                return {
                    ...char,
                    id: 1,
                    episodes: {
                        ...char.episodes,
                        getItems: () => mockEpisodes,
                    },
                } as Character;
            });

            const result = await service.create(dto);

            expect(episodeService.validateAndFetchEpisodes).toHaveBeenCalledWith(['A New Hope']);
            expect(characterRepo.create).toHaveBeenCalled();
            expect(result.name).toBe('Luke');
        });
    });

    describe('findAndPaginate', () => {
        it('should return paginated characters', async () => {
            characterRepo.findAndPaginate.mockResolvedValue({
                characters: [mockCharacter],
                metadata: {
                    totalRecords: 10,
                    currentPage: 2,
                    totalPages: 5,
                    limit: 2,
                    prevPage: 1,
                    nextPage: 3,
                },
            });

            const result = await service.findAndPaginate(0, 10);
            expect(result.characters[0].name).toBe('Luke');
            expect(characterRepo.findAndPaginate).toHaveBeenCalledWith(0, 10);
        });
    });

    describe('findOneBy', () => {
        it('should return a character', async () => {
            characterRepo.findOneBy.mockResolvedValue(mockCharacter);
            const result = await service.findOne(1);
            expect(result).toEqual(mockCharacter);
        });

        it('should throw NotFoundException', async () => {
            characterRepo.findOneBy.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a character', async () => {
            const dto = {
                name: 'Luke Skywalker',
                planet: 'Dagobah',
                episodes: ['A New Hope'],
            };

            characterRepo.findOneBy.mockResolvedValue(mockCharacter);
            episodeService.validateAndFetchEpisodes.mockResolvedValue(mockEpisodes);
            characterRepo.update.mockResolvedValue({
                ...mockCharacter,
                name: 'Luke Skywalker',
                planet: 'Dagobah',
            });

            const result = await service.update(1, dto);

            expect(result.name).toBe('Luke Skywalker');
            expect(result.planet).toBe('Dagobah');
            expect(episodeService.validateAndFetchEpisodes).toHaveBeenCalled();
        });

        it('should throw NotFoundException if character not found', async () => {
            characterRepo.findOneBy.mockResolvedValue(null);
            await expect(service.update(1, { name: 'Obi-Wan' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should delete a character', async () => {
            characterRepo.findOneBy.mockResolvedValue(mockCharacter);
            await service.remove(1);
            expect(characterRepo.delete).toHaveBeenCalledWith(mockCharacter);
        });

        it('should throw NotFoundException if not found', async () => {
            characterRepo.findOneBy.mockResolvedValue(null);
            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });
    });
});