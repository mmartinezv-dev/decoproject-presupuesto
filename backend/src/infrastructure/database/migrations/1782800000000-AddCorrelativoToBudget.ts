import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCorrelativoToBudget1782800000000 implements MigrationInterface {
  name = 'AddCorrelativoToBudget1782800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`budget\` ADD \`correlativo\` int NULL`,
    );

    // Assign sequential correlatives to existing budgets ordered by createdAt
    await queryRunner.query(`SET @row := 0`);
    await queryRunner.query(
      `UPDATE \`budget\` SET \`correlativo\` = (@row := @row + 1) ORDER BY \`createdAt\` ASC`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`budget\` DROP COLUMN \`correlativo\``,
    );
  }
}
