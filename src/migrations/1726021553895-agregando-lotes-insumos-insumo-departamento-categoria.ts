import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoLotesInsumosInsumoDepartamentoCategoria1726021553895 implements MigrationInterface {
    name = 'AgregandoLotesInsumosInsumoDepartamentoCategoria1726021553895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_2b5bb4e611d11be93241e04611f"`);
        await queryRunner.query(`CREATE TABLE "categoria" ("id" uuid NOT NULL, "nombre" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "insumoDepartamento" ("id" uuid NOT NULL, "existencia" double precision NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "insumoId" uuid, "departamentoId" uuid, CONSTRAINT "PK_545c19b2e095e6d5ccf6c535347" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "insumo" ("id" uuid NOT NULL, "codigo" character varying(12) NOT NULL, "nombre" character varying(255) NOT NULL, "trazador" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "categoriaId" uuid, CONSTRAINT "PK_5d2039ce43d4611cfaf0a04f879" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "numero_lote"`);
        await queryRunner.query(`ALTER TABLE "antecedentes" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "numeroLote" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "status" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "PK_db72652dca29e9e818c3c10abed"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "PK_db72652dca29e9e818c3c10abed" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "insumoId"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "insumoId" uuid`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" ADD CONSTRAINT "FK_81ee2e16bc597fdd6673679c6f3" FOREIGN KEY ("insumoId") REFERENCES "insumo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" ADD CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd" FOREIGN KEY ("departamentoId") REFERENCES "departamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insumo" ADD CONSTRAINT "FK_ec47364c2f8895e0d3a8d003b03" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_2b5bb4e611d11be93241e04611f" FOREIGN KEY ("insumoId") REFERENCES "insumo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_2b5bb4e611d11be93241e04611f"`);
        await queryRunner.query(`ALTER TABLE "insumo" DROP CONSTRAINT "FK_ec47364c2f8895e0d3a8d003b03"`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" DROP CONSTRAINT "FK_ad5130fd2cdc17f58e1adab0ffd"`);
        await queryRunner.query(`ALTER TABLE "insumoDepartamento" DROP CONSTRAINT "FK_81ee2e16bc597fdd6673679c6f3"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "insumoId"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "insumoId" integer`);
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "PK_db72652dca29e9e818c3c10abed"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "PK_db72652dca29e9e818c3c10abed" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP COLUMN "numeroLote"`);
        await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "pacientes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "antecedentes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD "numero_lote" character varying(50) NOT NULL`);
        await queryRunner.query(`DROP TABLE "insumo"`);
        await queryRunner.query(`DROP TABLE "insumoDepartamento"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_2b5bb4e611d11be93241e04611f" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
