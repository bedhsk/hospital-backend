import { MigrationInterface, QueryRunner } from "typeorm";

export class MovimientoLote1729398618505 implements MigrationInterface {
    name = 'MovimientoLote1729398618505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lote" RENAME COLUMN "fechaEntrada" TO "created_at"`);
        await queryRunner.query(`CREATE TABLE "movimientoLote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cantidad" integer NOT NULL, "loteId" uuid, "detalleAdquisicionId" uuid, "detalleRetiroId" uuid, CONSTRAINT "PK_a837d13b2b4fbccc347e38eab8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "movimientoLote" ADD CONSTRAINT "FK_4fe15be6c63f0173d22f7e00c50" FOREIGN KEY ("loteId") REFERENCES "lote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientoLote" ADD CONSTRAINT "FK_6327e9739da90c8cf9c2c43f9ce" FOREIGN KEY ("detalleAdquisicionId") REFERENCES "detalleAdquisicion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientoLote" ADD CONSTRAINT "FK_5e09a2a7d5a3cc9fa1ea0586bea" FOREIGN KEY ("detalleRetiroId") REFERENCES "detalleRetiro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movimientoLote" DROP CONSTRAINT "FK_5e09a2a7d5a3cc9fa1ea0586bea"`);
        await queryRunner.query(`ALTER TABLE "movimientoLote" DROP CONSTRAINT "FK_6327e9739da90c8cf9c2c43f9ce"`);
        await queryRunner.query(`ALTER TABLE "movimientoLote" DROP CONSTRAINT "FK_4fe15be6c63f0173d22f7e00c50"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "created_at" date NOT NULL`);
        await queryRunner.query(`DROP TABLE "movimientoLote"`);
        await queryRunner.query(`ALTER TABLE "lote" RENAME COLUMN "created_at" TO "fechaEntrada"`);
    }

}
