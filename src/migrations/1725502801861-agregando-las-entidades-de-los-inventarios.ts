import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoLasEntidadesDeLosInventarios1725502801861 implements MigrationInterface {
    name = 'AgregandoLasEntidadesDeLosInventarios1725502801861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "indice_insumos" ("id" SERIAL NOT NULL, "promedio_demanda_real" integer NOT NULL DEFAULT '0', "existencia_fisica" integer NOT NULL DEFAULT '0', "puesto" character varying(50) NOT NULL, "insumoId" integer, CONSTRAINT "PK_1ba0067f608c47788d075e2ab10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lote" ("id" SERIAL NOT NULL, "numero_lote" character varying(50) NOT NULL, "fechaFabricacion" date NOT NULL, "fechaCaducidad" date NOT NULL, "cantidad" integer NOT NULL DEFAULT '0', "insumoId" integer, CONSTRAINT "PK_db72652dca29e9e818c3c10abed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "insumos" ("id" SERIAL NOT NULL, "trazador" boolean NOT NULL DEFAULT false, "codigo" character varying(12) NOT NULL, "nombre" character varying(255) NOT NULL, "categoria" character varying(100) NOT NULL, "departamento" character varying(100) NOT NULL, CONSTRAINT "PK_b4e1b727a7b140e698e3a3dc7af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movimiento_insumo" ("id" SERIAL NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), "cantidad" integer NOT NULL, "ingreso" boolean NOT NULL DEFAULT true, "descripcion" character varying(255), "insumoId" integer, CONSTRAINT "PK_dfbb6f5d1958ed45fff6731b5fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "indice_insumos" ADD CONSTRAINT "FK_c5d332436f38edbbea168987ffa" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_2b5bb4e611d11be93241e04611f" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimiento_insumo" ADD CONSTRAINT "FK_4ff7e352750a48da020d80b89e8" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movimiento_insumo" DROP CONSTRAINT "FK_4ff7e352750a48da020d80b89e8"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_2b5bb4e611d11be93241e04611f"`);
        await queryRunner.query(`ALTER TABLE "indice_insumos" DROP CONSTRAINT "FK_c5d332436f38edbbea168987ffa"`);
        await queryRunner.query(`DROP TABLE "movimiento_insumo"`);
        await queryRunner.query(`DROP TABLE "insumos"`);
        await queryRunner.query(`DROP TABLE "lote"`);
        await queryRunner.query(`DROP TABLE "indice_insumos"`);
    }

}
