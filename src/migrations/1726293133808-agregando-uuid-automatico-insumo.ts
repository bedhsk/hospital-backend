import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoUuidAutomaticoInsumo1726293133808 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "insumo"
            ALTER COLUMN "id" SET DATA TYPE uuid USING (uuid_generate_v4()),
            ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "insumo"
            ALTER COLUMN "id" DROP DEFAULT,
            ALTER COLUMN "id" SET DATA TYPE varchar;
          `);
    }

}
