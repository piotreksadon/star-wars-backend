import { IsArray, IsOptional, IsString } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {Optional} from "@nestjs/common";

export class CreateCharacterDto {
    @IsString()
    @ApiProperty()
    name: string;

    //we could add a validation based on enum of real life existing episodes
    @IsArray()
    @ApiProperty({ type: [String] })
    episodes: string[];

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    planet?: string;
}
