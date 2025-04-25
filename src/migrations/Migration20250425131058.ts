import { Migration } from '@mikro-orm/migrations';

export class Migration20250425131058 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "starwars";`);
    this.addSql(`create table "starwars"."character" ("id" serial primary key, "name" varchar(255) not null, "planet" varchar(255) null);`);

    this.addSql(`create table "starwars"."episode" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "starwars"."episode" add constraint "episode_name_unique" unique ("name");`);

    this.addSql(`create table "starwars"."character_episodes" ("character_id" int not null, "episode_id" int not null, constraint "character_episodes_pkey" primary key ("character_id", "episode_id"));`);

    this.addSql(`alter table "starwars"."character_episodes" add constraint "character_episodes_character_id_foreign" foreign key ("character_id") references "starwars"."character" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "starwars"."character_episodes" add constraint "character_episodes_episode_id_foreign" foreign key ("episode_id") references "starwars"."episode" ("id") on update cascade on delete cascade;`);
  }

}
