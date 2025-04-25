import { Test, TestingModule } from '@nestjs/testing';
import { CharacterController } from './character.controller';
import { CharacterService } from '../service/character.service';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';
import { Character } from '../entity/character.entity';
import { Collection } from '@mikro-orm/core';

describe('CharacterController', () => {
    let controller: CharacterController;
    let service: CharacterService;

    const mockCharacter: Character = {
        id: 1,
        name: 'Luke Skywalker',
        episodes: new Collection<any>([]),
        planet: 'Tatooine',
    } as unknown as Character;

    const characterServiceMock = {
        create: jest.fn(),
        findAndPaginate: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CharacterController],
            providers: [
                { provide: CharacterService, useValue: characterServiceMock },
            ],
        }).compile();

        controller = module.get<CharacterController>(CharacterController);
        service = module.get<CharacterService>(CharacterService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a character', async () => {
        const dto: CreateCharacterDto = {
            name: 'Luke Skywalker',
            episodes: ['NEWHOPE', 'EMPIRE'],
            planet: 'Tatooine',
        };

        mockCharacter.episodes.getItems = jest.fn().mockReturnValue([
            { name: 'NEWHOPE' },
            { name: 'EMPIRE' },
        ]);

        characterServiceMock.create.mockResolvedValue(mockCharacter);

        const result = await controller.create(dto);

        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual({
            name: 'Luke Skywalker',
            episodes: ['NEWHOPE', 'EMPIRE'],
            planet: 'Tatooine',
        });
    });

    it('should return paginated characters', async () => {
        const mockPagination = {
            characters: [mockCharacter],
            metadata: {
                totalRecords: 1,
                currentPage: 1,
                totalPages: 1,
                limit: 10,
                prevPage: null,
                nextPage: null,
            },
        };

        characterServiceMock.findAndPaginate.mockResolvedValue(mockPagination);

        const result = await controller.findAll(0, 10);
        expect(result).toEqual(mockPagination);
    });

    it('should return a single character by ID', async () => {
        mockCharacter.episodes.getItems = jest.fn().mockReturnValue([
            { name: 'JEDI' },
        ]);

        characterServiceMock.findOne.mockResolvedValue(mockCharacter);

        const result = await controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual({
            name: 'Luke Skywalker',
            episodes: ['JEDI'],
            planet: 'Tatooine',
        });
    });

    it('should update a character', async () => {
        const updateDto: UpdateCharacterDto = {
            name: 'Luke S.',
            episodes: ['EMPIRE'],
            planet: 'Dagobah',
        };

        mockCharacter.episodes.getItems = jest.fn().mockReturnValue([
            { name: 'EMPIRE' },
        ]);

        characterServiceMock.update.mockResolvedValue(mockCharacter);

        const result = await controller.update(1, updateDto);
        expect(service.update).toHaveBeenCalledWith(1, updateDto);
        expect(result).toEqual({
            name: 'Luke Skywalker',
            episodes: ['EMPIRE'],
            planet: 'Tatooine',
        });
    });

    it('should delete a character', async () => {
        characterServiceMock.remove.mockResolvedValue(undefined);
        await controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
    });
});