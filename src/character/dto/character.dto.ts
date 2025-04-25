import { IsArray, IsOptional, IsString } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

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
