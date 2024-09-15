import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeatureRecetas1726375913996 implements MigrationInterface {
    name = 'AddFeatureRecetas1726375913996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_373920b009a98b595cf6c419c38"`);
        await queryRunner.query(`CREATE TABLE "recetas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(60) NOT NULL, "is_Active" boolean NOT NULL DEFAULT true, "userId" uuid, "pacienteId" uuid, CONSTRAINT "PK_a6aab8454e63427220402884c73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "departamentoId"`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD CONSTRAINT "FK_51d2218f611aafe6c351dd722fa" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD CONSTRAINT "FK_3769c874124e7706f06b1e59b83" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" DROP CONSTRAINT "FK_3769c874124e7706f06b1e59b83"`);
        await queryRunner.query(`ALTER TABLE "recetas" DROP CONSTRAINT "FK_51d2218f611aafe6c351dd722fa"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "departamentoId" uuid`);
        await queryRunner.query(`DROP TABLE "recetas"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_373920b009a98b595cf6c419c38" FOREIGN KEY ("departamentoId") REFERENCES "departamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
