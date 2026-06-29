import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokensTable1750000000001 implements MigrationInterface {
  name = 'CreateRefreshTokensTable1750000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`refresh_token\` (
        \`jti\` varchar(36) NOT NULL,
        \`expiresAt\` datetime NOT NULL,
        PRIMARY KEY (\`jti\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`refresh_token\``);
  }
}
