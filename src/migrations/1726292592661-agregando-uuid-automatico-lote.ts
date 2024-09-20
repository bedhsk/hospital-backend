import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoUuidAutomaticoLote1726292592661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "lote"
          ALTER COLUMN "id" SET DATA TYPE uuid USING (uuid_generate_v4());
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "lote"
          ALTER COLUMN "id" SET DATA TYPE character varying;
        `);
      }

}
