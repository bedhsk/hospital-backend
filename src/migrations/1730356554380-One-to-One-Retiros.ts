import { MigrationInterface, QueryRunner } from "typeorm";

export class OneToOneRetiros1730356554380 implements MigrationInterface {
    name = 'OneToOneRetiros1730356554380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" ADD "retiroId" uuid`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD CONSTRAINT "UQ_112b561816a1bd1e84edd3e8c65" UNIQUE ("retiroId")`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "UQ_66bf0ec42edb12db957d10ae06a" UNIQUE ("retiroId")`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recetas" ADD CONSTRAINT "FK_112b561816a1bd1e84edd3e8c65" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recetas" DROP CONSTRAINT "FK_112b561816a1bd1e84edd3e8c65"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "UQ_66bf0ec42edb12db957d10ae06a"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recetas" DROP CONSTRAINT "UQ_112b561816a1bd1e84edd3e8c65"`);
        await queryRunner.query(`ALTER TABLE "recetas" DROP COLUMN "retiroId"`);
    }

}
