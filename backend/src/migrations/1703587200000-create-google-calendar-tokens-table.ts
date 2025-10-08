import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGoogleCalendarTokensTable1703587200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'google_calendar_tokens',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'accessToken',
            type: 'text',
          },
          {
            name: 'refreshToken',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'expiryDate',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'scope',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'tokenType',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_google_calendar_tokens_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_google_calendar_tokens_user_id',
            columnNames: ['user_id'],
          },
          {
            name: 'IDX_google_calendar_tokens_active',
            columnNames: ['user_id', 'isActive'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('google_calendar_tokens');
  }
}