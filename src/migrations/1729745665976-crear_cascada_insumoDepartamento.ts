import { MigrationInterface, QueryRunner } from "typeorm";

export class CrearCascadaInsumoDepartamento1729745665976 implements MigrationInterface {
    name = 'CrearCascadaInsumoDepartamento1729745665976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" DROP CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ALTER COLUMN "estado" SET DEFAULT 'Pendiente'`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" ADD CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" DROP CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ALTER COLUMN "estado" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" ADD CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
