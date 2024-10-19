import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyRelations1728878493578 implements MigrationInterface {
    name = 'ModifyRelations1728878493578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58"`);
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP COLUMN "pacienteId"`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD "antecedenteId" uuid`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD CONSTRAINT "UQ_35a26dc8f0bd4846e67b02745d9" UNIQUE ("antecedenteId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "departamentoId" uuid`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD CONSTRAINT "FK_35a26dc8f0bd4846e67b02745d9" FOREIGN KEY ("antecedenteId") REFERENCES "antecedentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_373920b009a98b595cf6c419c38" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_373920b009a98b595cf6c419c38"`);
        await queryRunner.query(`ALTER TABLE "pacientes" DROP CONSTRAINT "FK_35a26dc8f0bd4846e67b02745d9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "departamentoId"`);
        await queryRunner.query(`ALTER TABLE "pacientes" DROP CONSTRAINT "UQ_35a26dc8f0bd4846e67b02745d9"`);
        await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "antecedenteId"`);
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD "pacienteId" uuid`);
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
