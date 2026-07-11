import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandImageColumnsToLongtext1789100000000
  implements MigrationInterface
{
  name = 'ExpandImageColumnsToLongtext1789100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`budget\` MODIFY \`images\` longtext NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` MODIFY \`visitFindings\` longtext NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` MODIFY \`logo\` longtext NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`budget\` MODIFY \`images\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` MODIFY \`visitFindings\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\` MODIFY \`logo\` text NOT NULL DEFAULT ''`,
    );
  }
}
