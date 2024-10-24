import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoEstadoReceta1729731953656 implements MigrationInterface {
    name = 'AgregandoEstadoReceta1729731953656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" ADD "estado" character varying(30) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" DROP COLUMN "estado"`);
    }

}
