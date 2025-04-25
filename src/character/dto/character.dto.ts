import { IsArray, IsOptional, IsString } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {Optional} from "@nestjs/common";
import {EpisodeDto} from "../../episode/dto/episode.dto";

export class CharacterDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsArray()
    @ApiProperty({ type: [String] })
    episodes: string[]

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    planet?: string;
}
