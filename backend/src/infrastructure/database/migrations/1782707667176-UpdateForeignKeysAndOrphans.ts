import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateForeignKeysAndOrphans1782707667176 implements MigrationInterface {
  name = 'UpdateForeignKeysAndOrphans1782707667176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` CHANGE \`clientId\` \`clientId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget_item\` DROP FOREIGN KEY \`FK_500905b400fb6c006bd6f1b5d1f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget_item\` CHANGE \`budgetId\` \`budgetId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`categoryId\` \`categoryId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget_item\` ADD CONSTRAINT \`FK_500905b400fb6c006bd6f1b5d1f\` FOREIGN KEY (\`budgetId\`) REFERENCES \`budget\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget_item\` DROP FOREIGN KEY \`FK_500905b400fb6c006bd6f1b5d1f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`categoryId\` \`categoryId\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget_item\` CHANGE \`budgetId\` \`budgetId\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget_item\` ADD CONSTRAINT \`FK_500905b400fb6c006bd6f1b5d1f\` FOREIGN KEY (\`budgetId\`) REFERENCES \`budget\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` CHANGE \`clientId\` \`clientId\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
