import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeRepository } from '../repository/episode.repository';
import { CreateEpisodeDto } from '../dto/create-episode.dto';
import { Episode } from '../entity/episode.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {EpisodeService} from "./episode.service";
import {IEpisodeRepository} from "../repository/episode-repository.port";

describe('EpisodeService', () => {
    let service: EpisodeService;
    let repo: jest.Mocked<EpisodeRepository>;

    const mockEpisode = new Episode();
    mockEpisode.name = 'A New Hope';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EpisodeService,
                {
                    provide: IEpisodeRepository,
                    useValue: {
                        findOneBy: jest.fn(),
                        findManyByNames: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<EpisodeService>(EpisodeService);
        repo = module.get(IEpisodeRepository);
    });

    afterEach(() => jest.clearAllMocks());

    describe('create', () => {
        it('should create a new episode if it does not exist', async () => {
            const dto: CreateEpisodeDto = { name: 'A New Hope' };

            repo.findOneBy.mockResolvedValue(null);
            repo.create.mockImplementation(async (ep: Episode) => ep);

            const result = await service.create(dto);

            expect(repo.findOneBy).toHaveBeenCalledWith({ name: dto.name });
            expect(repo.create).toHaveBeenCalled();
            expect(result.name).toBe(dto.name);
        });

        it('should throw BadRequestException if episode already exists', async () => {
            const dto: CreateEpisodeDto = { name: 'A New Hope' };

            repo.findOneBy.mockResolvedValue(mockEpisode);

            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
            expect(repo.create).not.toHaveBeenCalled();
        });
    });

    describe('findManyByNames', () => {
        it('should return episodes if found', async () => {
            repo.findManyByNames.mockResolvedValue([mockEpisode]);

            const result = await service.findManyByNames(['A New Hope']);
            expect(result).toEqual([mockEpisode]);
            expect(repo.findManyByNames).toHaveBeenCalledWith(['A New Hope']);
        });

        it('should throw NotFoundException if none found', async () => {
            repo.findManyByNames.mockResolvedValue([]);

            await expect(service.findManyByNames(['Invalid'])).rejects.toThrow(NotFoundException);
        });
    });

    describe('validateAndFetchEpisodes', () => {
        it('should return episodes if all are found', async () => {
            repo.findManyByNames.mockResolvedValue([mockEpisode]);

            const result = await service.validateAndFetchEpisodes(['A New Hope']);
            expect(result).toEqual([mockEpisode]);
        });

        it('should throw NotFoundException if some episodes are missing', async () => {
            repo.findManyByNames.mockResolvedValue([]);

            await expect(
                service.validateAndFetchEpisodes(['A New Hope']),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException with missing names listed', async () => {
            repo.findManyByNames.mockResolvedValue([mockEpisode]);

            await expect(
                service.validateAndFetchEpisodes(['A New Hope', 'The Phantom Menace']),
            ).rejects.toThrow(/Episodes not found: The Phantom Menace/);
        });
    });
});