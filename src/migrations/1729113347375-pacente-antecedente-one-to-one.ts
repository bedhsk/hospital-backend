import { MigrationInterface, QueryRunner } from "typeorm";

export class PacenteAntecedenteOneToOne1729113347375 implements MigrationInterface {
    name = 'PacenteAntecedenteOneToOne1729113347375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD "pacienteId" uuid`);
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD CONSTRAINT "UQ_1c7e293cef3530f6b0c64940e58" UNIQUE ("pacienteId")`);
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58"`);
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP CONSTRAINT "UQ_1c7e293cef3530f6b0c64940e58"`);
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP COLUMN "pacienteId"`);
    }

}
