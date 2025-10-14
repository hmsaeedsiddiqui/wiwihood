import { MigrationInterface, QueryRunner } from "typeorm"

export class InitialMigration1697123456789 implements MigrationInterface {
    name = 'InitialMigration1697123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension first
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        
        // Create database schema step by step to avoid conflicts
        console.log("Creating database schema...");
        
        // Set synchronize to true temporarily to let TypeORM create tables
        const dataSource = queryRunner.connection;
        if (dataSource && dataSource.options) {
            (dataSource.options as any).synchronize = true;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all tables
        await queryRunner.query(`DROP SCHEMA public CASCADE`);
        await queryRunner.query(`CREATE SCHEMA public`);
    }
}