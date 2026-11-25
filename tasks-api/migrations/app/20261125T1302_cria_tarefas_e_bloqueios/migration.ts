#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8991a0394920c56d53a90019bc2d04a03189432d239fa829fc6c33536f37ab95/contract';
import startContract from '../../snapshots/8991a0394920c56d53a90019bc2d04a03189432d239fa829fc6c33536f37ab95/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9e169a162b36be81851cd6edbe33d2ad4b19a7bba7b0e3d61992d19bf0322884/contract';
import endContract from '../../snapshots/9e169a162b36be81851cd6edbe33d2ad4b19a7bba7b0e3d61992d19bf0322884/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Task',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('priority', 'text', {
            notNull: true,
            default: lit('Média'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('todo'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'TaskBlock',
        columns: [
          col('blockedId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('blockerId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'TaskBlock',
        constraint: 'TaskBlock_blockerId_blockedId_key',
        columns: ['blockerId', 'blockedId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TaskBlock',
        index: 'TaskBlock_blockedId_idx_e3047657',
        columns: ['blockedId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TaskBlock',
        index: 'TaskBlock_blockerId_idx_a25bd35c',
        columns: ['blockerId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TaskBlock',
        foreignKey: {
          name: 'TaskBlock_blockerId_fkey',
          columns: ['blockerId'],
          references: { schema: 'public', table: 'Task', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TaskBlock',
        foreignKey: {
          name: 'TaskBlock_blockedId_fkey',
          columns: ['blockedId'],
          references: { schema: 'public', table: 'Task', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
