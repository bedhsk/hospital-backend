import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoEstadoRecetaEnum1729735054056 implements MigrationInterface {
    name = 'AgregandoEstadoRecetaEnum1729735054056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" DROP COLUMN "estado"`);
        await queryRunner.query(`CREATE TYPE "public"."recetas_estado_enum" AS ENUM('Pendiente', 'Entregado')`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD "estado" "public"."recetas_estado_enum" NOT NULL DEFAULT 'Pendiente'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" DROP COLUMN "estado"`);
        await queryRunner.query(`DROP TYPE "public"."recetas_estado_enum"`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD "estado" character varying(30) NOT NULL`);
    }

}
