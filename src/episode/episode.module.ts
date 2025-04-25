import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {Episode} from "./entity/episode.entity";
import {EpisodeController} from "./controller/episode.controller";
import {EpisodeRepository} from "./repository/episode.repository";
import {EpisodeService} from "./service/episode.service";

@Module({
    imports: [MikroOrmModule.forFeature([Episode])],
    controllers: [EpisodeController],
    providers: [EpisodeService, EpisodeRepository],
    exports: [EpisodeService]
})
export class EpisodeModule {}