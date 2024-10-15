import { MigrationInterface, QueryRunner } from "typeorm";

export class RetirosModifyCantidad1728874473453 implements MigrationInterface {
    name = 'RetirosModifyCantidad1728874473453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalleRetiro" DROP COLUMN "cantidad"`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ADD "cantidad" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalleRetiro" DROP COLUMN "cantidad"`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ADD "cantidad" boolean NOT NULL DEFAULT true`);
    }

}
