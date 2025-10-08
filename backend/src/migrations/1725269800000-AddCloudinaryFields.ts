import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCloudinaryFields1725269800000 implements MigrationInterface {
  name = 'AddCloudinaryFields1725269800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add cloudinary_public_id fields to relevant tables
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "profile_picture_public_id" varchar(255) DEFAULT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "providers" 
      ADD COLUMN "logo_public_id" varchar(255) DEFAULT NULL,
      ADD COLUMN "cover_image_public_id" varchar(255) DEFAULT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "services" 
      ADD COLUMN "images_public_ids" text DEFAULT NULL
    `);

    // Add indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_users_profile_picture_public_id" 
      ON "users" ("profile_picture_public_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_providers_logo_public_id" 
      ON "providers" ("logo_public_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_providers_cover_image_public_id" 
      ON "providers" ("cover_image_public_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_providers_cover_image_public_id"`);
    await queryRunner.query(`DROP INDEX "IDX_providers_logo_public_id"`);
    await queryRunner.query(`DROP INDEX "IDX_users_profile_picture_public_id"`);

    // Drop columns
    await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "images_public_ids"`);
    await queryRunner.query(`
      ALTER TABLE "providers" 
      DROP COLUMN "cover_image_public_id",
      DROP COLUMN "logo_public_id"
    `);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_picture_public_id"`);
  }
}
