import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUnaccentExtension1730356554381 implements MigrationInterface {
  name = 'AddUnaccentExtension1730356554381';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create unaccent extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop unaccent extension
    await queryRunner.query(`DROP EXTENSION IF EXISTS unaccent;`);
  }
}
