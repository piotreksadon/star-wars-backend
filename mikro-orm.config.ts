
import * as dotenv from 'dotenv';
import { defineConfig } from "@mikro-orm/postgresql";
dotenv.config();

export default defineConfig({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    debug: process.env.DB_DEBUG === 'true',
    schema: 'starwars',
    migrations: {
        tableName: 'migrations',
        disableForeignKeys: false,
        path: 'dist/src/migrations',
        pathTs: 'src/migrations',
        snapshotName: 'snapshotName',
    },
});