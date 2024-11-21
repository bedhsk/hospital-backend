import { MigrationInterface, QueryRunner } from "typeorm";

export class PacientesDatosAgregados1732154309895 implements MigrationInterface {
    name = 'PacientesDatosAgregados1732154309895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pacientes" ADD "municipio" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD "comunidad" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD "telefono" character varying(12)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "telefono"`);
        await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "comunidad"`);
        await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "municipio"`);
    }

}
