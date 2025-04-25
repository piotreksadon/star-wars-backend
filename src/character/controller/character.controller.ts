import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    ParseIntPipe, Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CharacterService } from '../service/character.service';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { Character } from '../entity/character.entity';
import {CharacterDto} from "../dto/character.dto";
import {UpdateCharacterDto} from "../dto/update-character.dto";

@ApiTags('Characters')
@Controller('characters')
export class CharacterController {
    constructor(private readonly characterService: CharacterService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new character' })
    @ApiResponse({ status: 201, description: 'Character created.', type: Character })
    async create(@Body() dto: CreateCharacterDto) {
        const createdCharacter = await this.characterService.create(dto);
        return {
            name: createdCharacter.name,
            episodes: createdCharacter.episodes.getItems().map(episode => episode.name),
            ...(createdCharacter.planet && { planet: createdCharacter.planet })
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get all characters' })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
        @Query('offset', ParseIntPipe) offset = 0,
        @Query('limit', ParseIntPipe) limit = 10,
    ) {
        return this.characterService.findAndPaginate(offset, limit);
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get a character by id' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CharacterDto> {
        const character = await this.characterService.findOne(id);

        return {
            name: character.name,
            episodes: character.episodes.getItems().map(episode => episode.name),
            ...(character.planet && { planet: character.planet })
        };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a character by ID' })
    @ApiResponse({ status: 200, description: 'Character updated', type: Character })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCharacterDto
    ) {
        const updated = await this.characterService.update(id, dto);
        return {
            name: updated.name,
            episodes: updated.episodes.getItems().map(e => e.name),
            ...(updated.planet && { planet: updated.planet }),
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a character by ID' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.characterService.remove(id);
    }
}