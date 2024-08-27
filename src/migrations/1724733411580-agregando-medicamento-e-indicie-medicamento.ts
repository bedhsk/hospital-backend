import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoMedicamentoEIndicieMedicamento1724733411580 implements MigrationInterface {
    name = 'AgregandoMedicamentoEIndicieMedicamento1724733411580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "indice_medicamentos" ("id" SERIAL NOT NULL, "promedio_demanda_real" integer NOT NULL, "existencia_fisica" integer NOT NULL, "existencia_disponible" double precision NOT NULL, "puesto" character varying(50) NOT NULL, "medicamentoId" integer, CONSTRAINT "PK_992db7364b7a742160ee050bcca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "medicamentos" ("id" SERIAL NOT NULL, "trazador" boolean NOT NULL DEFAULT false, "categoria" character varying(255) NOT NULL, "codigo" character varying(255) NOT NULL, "nombre" character varying(255) NOT NULL, CONSTRAINT "PK_3985b0c130d1322e867f7ad5ee9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "indice_medicamentos" ADD CONSTRAINT "FK_34e50a57375143149b08a9fbe1e" FOREIGN KEY ("medicamentoId") REFERENCES "medicamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "indice_medicamentos" DROP CONSTRAINT "FK_34e50a57375143149b08a9fbe1e"`);
        await queryRunner.query(`DROP TABLE "medicamentos"`);
        await queryRunner.query(`DROP TABLE "indice_medicamentos"`);
    }

}
