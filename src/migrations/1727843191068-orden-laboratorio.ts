import { MigrationInterface, QueryRunner } from "typeorm";

export class OrdenLaboratorio1727843191068 implements MigrationInterface {
    name = 'OrdenLaboratorio1727843191068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "examen" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(50) NOT NULL, "descripcion" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8c4d5930719648a3d06b13a60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ordenLaboratorio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" text NOT NULL, "estado" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "usuarioId" uuid, "retiroId" uuid, "pacienteId" uuid, "examenId" uuid, CONSTRAINT "PK_38653e3284b2ce9365d6496d625" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_5856fdcdbaa5d51c845ccbba659" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a" FOREIGN KEY ("retiroId") REFERENCES "retiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_2134ca6b632239590b342e6e9a4" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" ADD CONSTRAINT "FK_3f4780351037a0c76a9e8e73477" FOREIGN KEY ("examenId") REFERENCES "examen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_3f4780351037a0c76a9e8e73477"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_2134ca6b632239590b342e6e9a4"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_66bf0ec42edb12db957d10ae06a"`);
        await queryRunner.query(`ALTER TABLE "ordenLaboratorio" DROP CONSTRAINT "FK_5856fdcdbaa5d51c845ccbba659"`);
        await queryRunner.query(`DROP TABLE "ordenLaboratorio"`);
        await queryRunner.query(`DROP TABLE "examen"`);
    }

}
