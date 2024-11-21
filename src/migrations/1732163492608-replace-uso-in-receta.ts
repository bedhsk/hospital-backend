import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceUsoInReceta1732163492608 implements MigrationInterface {
    name = 'ReplaceUsoInReceta1732163492608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumoExamen" DROP COLUMN "cada_horas"`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" DROP COLUMN "por_dias"`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" ADD "uso" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumoExamen" DROP COLUMN "uso"`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" ADD "por_dias" integer`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" ADD "cada_horas" integer`);
    }

}
