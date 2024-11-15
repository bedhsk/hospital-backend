import { MigrationInterface, QueryRunner } from "typeorm";

export class OneToManyOrdsExams1731601594176 implements MigrationInterface {
    name = 'OneToManyOrdsExams1731601594176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_3f4780351037a0c76a9e8e73477"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "UQ_3f4780351037a0c76a9e8e73477"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_3f4780351037a0c76a9e8e73477" FOREIGN KEY ("examenId") REFERENCES "examen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_3f4780351037a0c76a9e8e73477"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "UQ_3f4780351037a0c76a9e8e73477" UNIQUE ("examenId")`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_3f4780351037a0c76a9e8e73477" FOREIGN KEY ("examenId") REFERENCES "examen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
