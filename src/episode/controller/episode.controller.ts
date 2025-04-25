import { ApiOperation, ApiResponse, ApiTags}  from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";
import { Episode } from "../entity/episode.entity";
import { CreateEpisodeDto } from "../dto/create-episode.dto";
import { EpisodeService } from "../service/episode.service";

@ApiTags('Episodes')
@Controller('episodes')
export class EpisodeController {
    constructor(private readonly episodeService: EpisodeService) {}

    //I made this controller to add episodes to database to be able to assign existing data to characters,
    // but in real life I would discuss adding them by seeders. In the end, new Star Wars episodes don't come out often.
    @Post()
    @ApiOperation({ summary: 'Create a new episode' })
    @ApiResponse({ status: 201, description: 'Episode created.', type: Episode })
    create(@Body() dto: CreateEpisodeDto) {
        return this.episodeService.create(dto);
    }
}