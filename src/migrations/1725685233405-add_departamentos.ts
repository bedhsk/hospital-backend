import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartamentos1725685233405 implements MigrationInterface {
    name = 'AddDepartamentos1725685233405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "departamentos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(60) NOT NULL, "is_Active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_6d34dc0415358a018818c683c1e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "departamentos"`);
    }

}
