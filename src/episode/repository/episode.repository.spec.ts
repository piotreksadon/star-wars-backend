import { EpisodeRepository } from './episode.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Episode } from '../entity/episode.entity';
import { CreateEpisodeDto } from '../dto/create-episode.dto';

describe('EpisodeRepository', () => {
    let repository: EpisodeRepository;
    let em: jest.Mocked<EntityManager>;

    beforeEach(() => {
        em = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            persistAndFlush: jest.fn(),
        } as any;

        repository = new EpisodeRepository(em);
    });

    describe('create', () => {
        it('should create an episode', async () => {
            const dto = new CreateEpisodeDto();
            dto.name = 'Return of the Jedi';

            const mockEpisode = dto as Episode;
            em.persistAndFlush.mockResolvedValue(undefined);

            const result = await repository.create(mockEpisode);

            expect(result).toEqual(mockEpisode);
            expect(em.persistAndFlush).toHaveBeenCalledWith(mockEpisode);
        });
    });

    describe('findManyByNames', () => {
        it('should return episodes by names', async () => {
            const names = ['A New Hope', 'Empire Strikes Back'];
            const episodes = [
                { id: 1, name: 'A New Hope' },
                { id: 2, name: 'Empire Strikes Back' },
            ] as Episode[];

            em.find.mockResolvedValue(episodes);

            const result = await repository.findManyByNames(names);

            expect(em.find).toHaveBeenCalledWith(Episode, { name: { $in: names } });
            expect(result).toEqual(episodes);
        });
    });

    describe('findOneBy', () => {
        it('should return an episode by name', async () => {
            const mockEpisode = { id: 1, name: 'A New Hope' } as Episode;
            em.findOne.mockResolvedValue(mockEpisode);

            const result = await repository.findOneBy({ name: 'A New Hope' });
            expect(result).toEqual(mockEpisode);
            expect(em.findOne).toHaveBeenCalledWith(Episode, { name: 'A New Hope' });
        });

        it('should return an episode by id', async () => {
            const mockEpisode = { id: 1, name: 'A New Hope' } as Episode;
            em.findOne.mockResolvedValue(mockEpisode);

            const result = await repository.findOneBy({ id: 1 });
            expect(result).toEqual(mockEpisode);
            expect(em.findOne).toHaveBeenCalledWith(Episode, { id: 1 });
        });

        it('should return null if no episode is found', async () => {
            em.findOne.mockResolvedValue(null);

            const result = await repository.findOneBy({ name: 'Nonexistent Episode' });
            expect(result).toBeNull();
            expect(em.findOne).toHaveBeenCalledWith(Episode, { name: 'Nonexistent Episode' });
        });
    });
});
