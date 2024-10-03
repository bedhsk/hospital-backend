import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabaseRetiro1727656182443 implements MigrationInterface {
    name = 'DatabaseRetiro1727656182443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "detalleRetiro" ("id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "cantidad" boolean NOT NULL DEFAULT true, "retiroId" uuid, "insumoDepartamentoId" uuid, CONSTRAINT "PK_b63cdb363343bd5964d012c95e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "retiros" ("id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "descripcion" character varying(255), "usuarioId" uuid, CONSTRAINT "PK_7c13632895933a7c6f56962f7a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ADD CONSTRAINT "FK_3c109fcfb0dfd1a64095182afcc" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" ADD CONSTRAINT "FK_74282d8fceb645d34488825c408" FOREIGN KEY ("insumoDepartamentoId") REFERENCES "insumoDepartamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retiros" ADD CONSTRAINT "FK_04ca5e265cac36f3148b54f7560" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retiros" DROP CONSTRAINT "FK_04ca5e265cac36f3148b54f7560"`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" DROP CONSTRAINT "FK_74282d8fceb645d34488825c408"`);
        await queryRunner.query(`ALTER TABLE "detalleRetiro" DROP CONSTRAINT "FK_3c109fcfb0dfd1a64095182afcc"`);
        await queryRunner.query(`DROP TABLE "retiros"`);
        await queryRunner.query(`DROP TABLE "detalleRetiro"`);
    }

}
