
import * as dotenv from 'dotenv';
import {defineConfig} from "@mikro-orm/postgresql";
dotenv.config();

export default defineConfig({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'starwars',
    password: 'maytheforcebewithyou',
    host: 'localhost',
    port: 5440,
    debug: true,
    schema: 'starwars',
    migrations: {
        tableName: 'migrations',
        disableForeignKeys: false,
        path: 'dist/src/migrations',
        pathTs: 'src/migrations',
        snapshotName: 'snapshotName',
    },
});