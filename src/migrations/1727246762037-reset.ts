import { MigrationInterface, QueryRunner } from "typeorm";

export class Reset1727246762037 implements MigrationInterface {
    name = 'Reset1727246762037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(60) NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(60) NOT NULL, "lastname" character varying(60) NOT NULL, "username" character varying(50) NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_Active" boolean NOT NULL DEFAULT true, "password" character varying NOT NULL, "roleId" uuid, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "antecedentes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "gestas" integer, "hijos_vivos" integer, "hijos_muertos" integer, "abortos" integer, "ultima_regla" date, "planificacion_familiar" character varying(255), "partos" integer, "cesareas" integer, "pacienteId" uuid, CONSTRAINT "PK_25815411ae4c2f4538fdb32ae6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pacientes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(60) NOT NULL, "sexo" character varying(10) NOT NULL, "cui" character varying(13), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nacimiento" date NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "familiares" character varying(255), "medicos" character varying(255), "quirurgicos" character varying(255), "traumaticos" character varying(255), "alergias" character varying(255), "vicios" character varying(255), CONSTRAINT "PK_aa9c9f624ff22fc06c44d8b1609" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "departamento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(60) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_7fd6f336280fd0c7a9318464723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categoria" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "insumo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(12) NOT NULL, "nombre" character varying(255) NOT NULL, "trazador" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "categoriaId" uuid, CONSTRAINT "PK_5d2039ce43d4611cfaf0a04f879" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "insumoDepartamento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "existencia" double precision NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "insumoId" uuid, "departamentoId" uuid, CONSTRAINT "PK_545c19b2e095e6d5ccf6c535347" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "numeroLote" character varying(255) NOT NULL, "fechaEntrada" date NOT NULL, "fechaCaducidad" date NOT NULL, "cantidadInical" integer NOT NULL DEFAULT '0', "cantidadActual" integer NOT NULL, "status" character varying(50), "is_active" boolean NOT NULL DEFAULT true, "insumoDepartamentoId" uuid, CONSTRAINT "PK_db72652dca29e9e818c3c10abed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insumo" ADD CONSTRAINT "FK_ec47364c2f8895e0d3a8d003b03" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" ADD CONSTRAINT "FK_81ee2e16bc597fdd6673679c6f3" FOREIGN KEY ("insumoId") REFERENCES "insumo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" ADD CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd" FOREIGN KEY ("departamentoId") REFERENCES "departamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_0a4d7ab421c27aa0d79fd198dc4" FOREIGN KEY ("insumoDepartamentoId") REFERENCES "insumoDepartamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_0a4d7ab421c27aa0d79fd198dc4"`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" DROP CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd"`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" DROP CONSTRAINT "FK_81ee2e16bc597fdd6673679c6f3"`);
        await queryRunner.query(`ALTER TABLE "insumo" DROP CONSTRAINT "FK_ec47364c2f8895e0d3a8d003b03"`);
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP CONSTRAINT "FK_1c7e293cef3530f6b0c64940e58"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`DROP TABLE "lote"`);
        await queryRunner.query(`DROP TABLE "insumoDepartamento"`);
        await queryRunner.query(`DROP TABLE "insumo"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`DROP TABLE "departamento"`);
        await queryRunner.query(`DROP TABLE "pacientes"`);
        await queryRunner.query(`DROP TABLE "antecedentes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
