import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecetaDetails1732129875398 implements MigrationInterface {
    name = 'AddRecetaDetails1732129875398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumoExamen" ADD "cada_horas" integer`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" ADD "por_dias" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumoExamen" DROP COLUMN "por_dias"`);
        await queryRunner.query(`ALTER TABLE "insumoExamen" DROP COLUMN "cada_horas"`);
    }

}
