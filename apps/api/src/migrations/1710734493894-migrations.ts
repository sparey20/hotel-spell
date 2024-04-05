import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1710734493894 implements MigrationInterface {
    name = 'Migrations1710734493894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Room" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "Room" ADD CONSTRAINT "FK_af7cd45a1c71d4c3a708d410173" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Room" DROP CONSTRAINT "FK_af7cd45a1c71d4c3a708d410173"`);
        await queryRunner.query(`ALTER TABLE "Room" DROP COLUMN "hotelId"`);
    }

}
