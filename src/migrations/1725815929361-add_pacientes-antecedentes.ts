import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPacientesAntecedentes1725815929361 implements MigrationInterface {
    name = 'AddPacientesAntecedentes1725815929361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pacientes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(60) NOT NULL, "sexo" character varying(10) NOT NULL, "cui" character varying(13), "nacimiento" date NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "familiares" character varying(255), "medicos" character varying(255), "quirurgicos" character varying(255), "traumaticos" character varying(255), "alergias" character varying(255), "vicios" character varying(255), CONSTRAINT "PK_aa9c9f624ff22fc06c44d8b1609" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "antecedentes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gestas" integer, "hijos_vivos" integer, "hijos_muertos" integer, "abortos" integer, "ultima_regla" date, "planificacion_familiar" character varying(255), "partos" integer, "cesareas" integer, "pacienteId" uuid, CONSTRAINT "PK_25815411ae4c2f4538fdb32ae6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58"`);
        await queryRunner.query(`DROP TABLE "antecedentes"`);
        await queryRunner.query(`DROP TABLE "pacientes"`);
    }

}
