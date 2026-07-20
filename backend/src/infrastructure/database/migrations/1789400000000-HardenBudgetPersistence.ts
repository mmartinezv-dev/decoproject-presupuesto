import { MigrationInterface, QueryRunner } from 'typeorm';

export class HardenBudgetPersistence1789400000000 implements MigrationInterface {
  name = 'HardenBudgetPersistence1789400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `budget` ADD `sections` text NULL');
    await queryRunner.query(
      'ALTER TABLE `budget_item` ADD `sectionIndex` int NULL',
    );

    await queryRunner.query(
      'DELETE FROM `budget_item` WHERE `budgetId` IS NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `budget_item` DROP FOREIGN KEY `FK_500905b400fb6c006bd6f1b5d1f`',
    );
    await queryRunner.query(
      'ALTER TABLE `budget_item` CHANGE `budgetId` `budgetId` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `budget_item` ADD CONSTRAINT `FK_500905b400fb6c006bd6f1b5d1f` FOREIGN KEY (`budgetId`) REFERENCES `budget`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_budget_correlativo_unique` ON `budget` (`correlativo`)',
    );
    await queryRunner.query(`
      CREATE TABLE \`budget_sequence\` (
        \`id\` tinyint NOT NULL,
        \`nextValue\` int NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await queryRunner.query(`
      INSERT INTO \`budget_sequence\` (\`id\`, \`nextValue\`)
      SELECT 1, COALESCE(MAX(\`correlativo\`), 0) + 1 FROM \`budget\`
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `budget_sequence`');
    await queryRunner.query(
      'DROP INDEX `IDX_budget_correlativo_unique` ON `budget`',
    );
    await queryRunner.query(
      'ALTER TABLE `budget_item` DROP FOREIGN KEY `FK_500905b400fb6c006bd6f1b5d1f`',
    );
    await queryRunner.query(
      'ALTER TABLE `budget_item` CHANGE `budgetId` `budgetId` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `budget_item` ADD CONSTRAINT `FK_500905b400fb6c006bd6f1b5d1f` FOREIGN KEY (`budgetId`) REFERENCES `budget`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `budget_item` DROP COLUMN `sectionIndex`',
    );
    await queryRunner.query('ALTER TABLE `budget` DROP COLUMN `sections`');
  }
}
