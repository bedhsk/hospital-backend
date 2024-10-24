import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEstadoToEnum1729742554779 implements MigrationInterface {
    name = 'ChangeEstadoToEnum1729742554779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Elimina la columna actual "estado" para reemplazarla por el enum
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP COLUMN "estado"`);

        // Crea el tipo ENUM nuevamente, si es necesario
        await queryRunner.query(`CREATE TYPE "public"."ordenLaboratorio_estado_enum" AS ENUM('Pendiente', 'Entregado')`);

        // Añade la columna con el nuevo tipo ENUM
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD "estado" "public"."ordenLaboratorio_estado_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir los cambios si es necesario
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP COLUMN "estado"`);

        // Elimina el tipo ENUM
        await queryRunner.query(`DROP TYPE "public"."ordenLaboratorio_estado_enum"`);

        // Vuelve a agregar la columna como `character varying` en caso de revertir
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD "estado" character varying NOT NULL`);
    }
}
