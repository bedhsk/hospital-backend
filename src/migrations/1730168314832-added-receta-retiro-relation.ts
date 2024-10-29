import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRecetaRetiroRelation1730168314832 implements MigrationInterface {
    name = 'AddedRecetaRetiroRelation1730168314832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retiros" ADD "recetaId" uuid`);
        await queryRunner.query(`ALTER TABLE "retiros" ADD CONSTRAINT "UQ_f37dc192167e4d88bcfea6442db" UNIQUE ("recetaId")`);
        await queryRunner.query(`ALTER TABLE "retiros" ADD CONSTRAINT "FK_f37dc192167e4d88bcfea6442db" FOREIGN KEY ("recetaId") REFERENCES "recetas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retiros" DROP CONSTRAINT "FK_f37dc192167e4d88bcfea6442db"`);
        await queryRunner.query(`ALTER TABLE "retiros" DROP CONSTRAINT "UQ_f37dc192167e4d88bcfea6442db"`);
        await queryRunner.query(`ALTER TABLE "retiros" DROP COLUMN "recetaId"`);
    }

}
