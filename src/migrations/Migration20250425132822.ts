import { Migration } from '@mikro-orm/migrations';

export class Migration20250425132822 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "starwars"."character_episodes" drop constraint "character_episodes_character_id_foreign";`);

    this.addSql(`create table "starwars"."characters" ("id" serial primary key, "name" varchar(255) not null, "planet" varchar(255) null);`);

    this.addSql(`create table "starwars"."characters_episodes" ("character_id" int not null, "episode_id" int not null, constraint "characters_episodes_pkey" primary key ("character_id", "episode_id"));`);

    this.addSql(`alter table "starwars"."characters_episodes" add constraint "characters_episodes_character_id_foreign" foreign key ("character_id") references "starwars"."characters" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "starwars"."characters_episodes" add constraint "characters_episodes_episode_id_foreign" foreign key ("episode_id") references "starwars"."episode" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "starwars"."character" cascade;`);

    this.addSql(`drop table if exists "starwars"."character_episodes" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "starwars"."characters_episodes" drop constraint "characters_episodes_character_id_foreign";`);

    this.addSql(`create table "starwars"."character" ("id" serial primary key, "name" varchar(255) not null, "planet" varchar(255) null);`);

    this.addSql(`create table "starwars"."character_episodes" ("character_id" int not null, "episode_id" int not null, constraint "character_episodes_pkey" primary key ("character_id", "episode_id"));`);

    this.addSql(`alter table "starwars"."character_episodes" add constraint "character_episodes_character_id_foreign" foreign key ("character_id") references "starwars"."character" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "starwars"."character_episodes" add constraint "character_episodes_episode_id_foreign" foreign key ("episode_id") references "starwars"."episode" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "starwars"."characters" cascade;`);

    this.addSql(`drop table if exists "starwars"."characters_episodes" cascade;`);
  }

}
