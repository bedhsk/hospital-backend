import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyRetiros1728718631979 implements MigrationInterface {
    name = 'ModifyRetiros1728718631979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" DROP CONSTRAINT "FK_3c109fcfb0dfd1a64095182afcc"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a"`);
        await queryRunner.query(`ALTER TABLE "retiros" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ADD CONSTRAINT "FK_3c109fcfb0dfd1a64095182afcc" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalleRetiro" DROP CONSTRAINT "FK_3c109fcfb0dfd1a64095182afcc"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a"`);
        await queryRunner.query(`ALTER TABLE "retiros" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ADD CONSTRAINT "FK_3c109fcfb0dfd1a64095182afcc" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
