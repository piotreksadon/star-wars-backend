import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Episode } from "../../episode/entity/episode.entity";

@Entity({tableName: 'characters', schema: 'starwars' })
export class Character {
    @PrimaryKey({ autoincrement: true })
    @ApiProperty()
    id!: number;

    @Property()
    @ApiProperty()
    name!: string;

    //I was torn apart between making the character.episodes just a field with multiple values (and I would do that if
    //the app should as simple as possible), and performing more elegant solution in case if we would like to
    //manage the episodes as independent entity. In real life I would discuss that matter with business side of the project.
    @ManyToMany(() => Episode)
    @ApiProperty()
    episodes = new Collection<Episode>(this);

    @Property({ nullable: true })
    @ApiProperty({ required: false })
    planet?: string;
}