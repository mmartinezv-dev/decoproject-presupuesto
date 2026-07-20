import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSectionManualTotalToBudgetItem1789300000000 implements MigrationInterface {
  name = 'AddSectionManualTotalToBudgetItem1789300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `budget_item` ADD `sectionManualTotal` decimal(14,2) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `budget_item` DROP COLUMN `sectionManualTotal`',
    );
  }
}
