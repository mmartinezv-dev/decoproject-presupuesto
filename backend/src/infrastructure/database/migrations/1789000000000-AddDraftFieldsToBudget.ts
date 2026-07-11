import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDraftFieldsToBudget1789000000000 implements MigrationInterface {
  name = 'AddDraftFieldsToBudget1789000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`budget\` ADD \`status\` varchar(10) NOT NULL DEFAULT 'final'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` ADD \`currentStep\` int NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_budget_status\` ON \`budget\` (\`status\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_budget_status\` ON \`budget\``);
    await queryRunner.query(
      `ALTER TABLE \`budget\` DROP COLUMN \`currentStep\``,
    );
    await queryRunner.query(`ALTER TABLE \`budget\` DROP COLUMN \`status\``);
  }
}
