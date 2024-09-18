import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoRelacionLoteYInsumomedicamneto1726022522465 implements MigrationInterface {
    name = 'AgregandoRelacionLoteYInsumomedicamneto1726022522465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lote" ADD "insumoDepartamentoId" uuid`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_0a4d7ab421c27aa0d79fd198dc4" FOREIGN KEY ("insumoDepartamentoId") REFERENCES "insumoDepartamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_0a4d7ab421c27aa0d79fd198dc4"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "insumoDepartamentoId"`);
    }

}
