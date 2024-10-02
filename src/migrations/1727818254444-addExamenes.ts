import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExamenes1727818254444 implements MigrationInterface {
    name = 'AddExamenes1727818254444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "examen" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(50) NOT NULL, "descripcion" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8c4d5930719648a3d06b13a60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "insumoExamen" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cantidad" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "insumoId" uuid NOT NULL, "examenId" uuid NOT NULL, CONSTRAINT "PK_47ae88ba44558bf53393fb03e1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" ADD CONSTRAINT "FK_e93d6bacca5a3623aeb0d630514" FOREIGN KEY ("insumoId") REFERENCES "insumo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" ADD CONSTRAINT "FK_2adeb84cb0664c077839631818e" FOREIGN KEY ("examenId") REFERENCES "examen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumoExamen" DROP CONSTRAINT "FK_2adeb84cb0664c077839631818e"`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" DROP CONSTRAINT "FK_e93d6bacca5a3623aeb0d630514"`);
        await queryRunner.query(`DROP TABLE "insumoExamen"`);
        await queryRunner.query(`DROP TABLE "examen"`);
    }

}
