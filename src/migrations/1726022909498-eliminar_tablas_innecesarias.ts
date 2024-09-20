import { MigrationInterface, QueryRunner } from "typeorm";

export class EliminarTablasInnecesarias1726021553897 implements MigrationInterface {
    name = 'EliminarTablasInnecesarias1726021553897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "movimiento_insumo"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "indice_insumos"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "insumos"`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recrea las tablas eliminadas si se necesita revertir la migración
        await queryRunner.query(`
            CREATE TABLE "movimiento_insumo" (
                "id" SERIAL NOT NULL,
                "fecha" TIMESTAMP NOT NULL,
                "cantidad" integer NOT NULL,
                "ingreso" boolean DEFAULT true,
                "descripcion" character varying(255),
                "insumoId" integer,
                CONSTRAINT "PK_dfbb6f5d1958ed45fff6731b5fc" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "indice_insumos" (
                "id" SERIAL NOT NULL,
                "promedio_demanda_real" integer DEFAULT '0',
                "existencia_fisica" integer DEFAULT '0',
                "puesto" character varying(50),
                "insumoId" integer,
                CONSTRAINT "PK_1ba0067f608c47788d075e2ab10" PRIMARY KEY ("id")
            )
        `);
    }
}
