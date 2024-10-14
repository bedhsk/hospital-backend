import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabaseAdquisicionesYDetalle1727639923552 implements MigrationInterface {
    name = 'DatabaseAdquisicionesYDetalle1727639923552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "adquisicion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "descripcion" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "usuarioId" uuid, CONSTRAINT "PK_15342430f096791d119ee14c845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "detalleAdquisicion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "cantidad" integer NOT NULL, "adquisicionId" uuid, "insumoDepartamentoId" uuid, CONSTRAINT "PK_b8627cd94a0691d1e3614add7c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "adquisicion" ADD CONSTRAINT "FK_885784e310a2dfadae6aa0680f1" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalleAdquisicion" ADD CONSTRAINT "FK_00ab1a24a9e4296a4c499563c16" FOREIGN KEY ("adquisicionId") REFERENCES "adquisicion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalleAdquisicion" ADD CONSTRAINT "FK_6ce226845011f6d7a3d32eb598d" FOREIGN KEY ("insumoDepartamentoId") REFERENCES "insumoDepartamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalleAdquisicion" DROP CONSTRAINT "FK_6ce226845011f6d7a3d32eb598d"`);
        await queryRunner.query(`ALTER TABLE "detalleAdquisicion" DROP CONSTRAINT "FK_00ab1a24a9e4296a4c499563c16"`);
        await queryRunner.query(`ALTER TABLE "adquisicion" DROP CONSTRAINT "FK_885784e310a2dfadae6aa0680f1"`);
        await queryRunner.query(`DROP TABLE "detalleAdquisicion"`);
        await queryRunner.query(`DROP TABLE "adquisicion"`);
    }

}