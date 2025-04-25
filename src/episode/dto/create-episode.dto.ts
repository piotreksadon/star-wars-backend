import { IsString, Matches } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateEpisodeDto {
    @IsString()
    @Matches(/^[A-Z]+$/, {
        message: 'Episode name must contain only capital letters (A-Z)',
    })
    @ApiProperty()
    name: string;
}
