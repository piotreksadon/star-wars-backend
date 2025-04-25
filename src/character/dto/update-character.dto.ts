import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateCharacterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    planet?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    episodes?: string[];
}