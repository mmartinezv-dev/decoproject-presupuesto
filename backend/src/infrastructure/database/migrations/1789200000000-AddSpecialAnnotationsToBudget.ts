import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialAnnotationsToBudget1789200000000 implements MigrationInterface {
  name = 'AddSpecialAnnotationsToBudget1789200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `budget` ADD `specialAnnotations` text NULL',
    );
    await queryRunner.query(
      'UPDATE `budget` SET `currentStep` = `currentStep` + 1 WHERE `currentStep` >= 4',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE `budget` SET `currentStep` = `currentStep` - 1 WHERE `currentStep` >= 5',
    );
    await queryRunner.query(
      'ALTER TABLE `budget` DROP COLUMN `specialAnnotations`',
    );
  }
}
