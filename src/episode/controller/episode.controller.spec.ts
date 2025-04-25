import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from '../service/episode.service';
import { CreateEpisodeDto } from '../dto/create-episode.dto';
import { Episode } from '../entity/episode.entity';

describe('EpisodeController', () => {
    let controller: EpisodeController;
    let service: jest.Mocked<EpisodeService>;

    const mockEpisode: Episode = {
        id: 1,
        name: 'The Phantom Menace',
    } as Episode;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EpisodeController],
            providers: [
                {
                    provide: EpisodeService,
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<EpisodeController>(EpisodeController);
        service = module.get(EpisodeService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('create', () => {
        it('should create and return a new episode', async () => {
            const dto: CreateEpisodeDto = { name: 'The Phantom Menace' };

            service.create.mockResolvedValue(mockEpisode);

            const result = await controller.create(dto);

            expect(service.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(mockEpisode);
        });
    });
});
