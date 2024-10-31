import { MigrationInterface, QueryRunner } from "typeorm";

export class OneToOneExamenes1730344135754 implements MigrationInterface {
    name = 'OneToOneExamenes1730344135754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" ADD "examenId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD CONSTRAINT "UQ_5b44ba1ee9afa3b1af735a82f78" UNIQUE ("examenId")`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_3f4780351037a0c76a9e8e73477"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "UQ_3f4780351037a0c76a9e8e73477" UNIQUE ("examenId")`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_3f4780351037a0c76a9e8e73477" FOREIGN KEY ("examenId") REFERENCES "examen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD CONSTRAINT "FK_5b44ba1ee9afa3b1af735a82f78" FOREIGN KEY ("examenId") REFERENCES "examen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" DROP CONSTRAINT "FK_5b44ba1ee9afa3b1af735a82f78"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_3f4780351037a0c76a9e8e73477"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "UQ_3f4780351037a0c76a9e8e73477"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_3f4780351037a0c76a9e8e73477" FOREIGN KEY ("examenId") REFERENCES "examen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recetas" DROP CONSTRAINT "UQ_5b44ba1ee9afa3b1af735a82f78"`);
        await queryRunner.query(`ALTER TABLE "recetas" DROP COLUMN "examenId"`);
    }

}
