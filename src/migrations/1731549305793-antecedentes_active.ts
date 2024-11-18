import { MigrationInterface, QueryRunner } from "typeorm";

export class AntecedentesActive1731549305793 implements MigrationInterface {
    name = 'AntecedentesActive1731549305793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP COLUMN "is_active"`);
    }

}
