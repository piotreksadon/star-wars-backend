import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Character } from "../../character/entity/character.entity";

@Entity({ schema: 'starwars' })
export class Episode {
    @PrimaryKey()
    id!: number;

    //we could add a restraint based on enum of existing episodes
    @Property({unique: true})
    name!: string;

    @ManyToMany(() => Character, character => character.episodes)
    characters = new Collection<Character>(this);
}