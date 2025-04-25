import {IsArray, IsOptional, IsString, Matches} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class EpisodeDto {
    @IsString()
    @ApiProperty()
    name: string;
}
