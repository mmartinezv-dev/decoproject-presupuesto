import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditColumnsAndIndexes1750000000000 implements MigrationInterface {
  name = 'AddAuditColumnsAndIndexes1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── budget: updatedAt ─────────────────────────────────────────────────────
    const budgetTable = await queryRunner.getTable('budget');
    const hasUpdatedAt = budgetTable?.columns.some((c) => c.name === 'updatedAt');
    if (!hasUpdatedAt) {
      await queryRunner.query(`
        ALTER TABLE \`budget\`
        ADD COLUMN \`updatedAt\` datetime(6) NOT NULL
          DEFAULT CURRENT_TIMESTAMP(6)
          ON UPDATE CURRENT_TIMESTAMP(6)
      `);
    }

    // ── budget: deletedAt ─────────────────────────────────────────────────────
    const hasDeletedAt = budgetTable?.columns.some((c) => c.name === 'deletedAt');
    if (!hasDeletedAt) {
      await queryRunner.query(`
        ALTER TABLE \`budget\`
        ADD COLUMN \`deletedAt\` datetime(6) NULL DEFAULT NULL
      `);
    }

    // ── Índice: budget.clientRut ──────────────────────────────────────────────
    const budgetTableFresh = await queryRunner.getTable('budget');
    const hasClientRutIdx = budgetTableFresh?.indices.some(
      (i) => i.name === 'IDX_budget_clientRut',
    );
    if (!hasClientRutIdx) {
      await queryRunner.query(
        `CREATE INDEX \`IDX_budget_clientRut\` ON \`budget\` (\`clientRut\`)`,
      );
    }

    // ── Índice: budget.createdAt ──────────────────────────────────────────────
    const hasCreatedAtIdx = budgetTableFresh?.indices.some(
      (i) => i.name === 'IDX_budget_createdAt',
    );
    if (!hasCreatedAtIdx) {
      await queryRunner.query(
        `CREATE INDEX \`IDX_budget_createdAt\` ON \`budget\` (\`createdAt\`)`,
      );
    }

    // ── Índice: product.categoryId ────────────────────────────────────────────
    const productTable = await queryRunner.getTable('product');
    const hasProductCatIdx = productTable?.indices.some(
      (i) => i.name === 'IDX_product_categoryId',
    );
    if (!hasProductCatIdx) {
      await queryRunner.query(
        `CREATE INDEX \`IDX_product_categoryId\` ON \`product\` (\`categoryId\`)`,
      );
    }

    // ── Índice: client.rut ────────────────────────────────────────────────────
    const clientTable = await queryRunner.getTable('client');
    const hasClientRutIdx2 = clientTable?.indices.some(
      (i) => i.name === 'IDX_client_rut',
    );
    if (!hasClientRutIdx2) {
      await queryRunner.query(
        `CREATE INDEX \`IDX_client_rut\` ON \`client\` (\`rut\`)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_client_rut\` ON \`client\``);
    await queryRunner.query(`DROP INDEX \`IDX_product_categoryId\` ON \`product\``);
    await queryRunner.query(`DROP INDEX \`IDX_budget_createdAt\` ON \`budget\``);
    await queryRunner.query(`DROP INDEX \`IDX_budget_clientRut\` ON \`budget\``);
    await queryRunner.query(`ALTER TABLE \`budget\` DROP COLUMN \`deletedAt\``);
    await queryRunner.query(`ALTER TABLE \`budget\` DROP COLUMN \`updatedAt\``);
  }
}
