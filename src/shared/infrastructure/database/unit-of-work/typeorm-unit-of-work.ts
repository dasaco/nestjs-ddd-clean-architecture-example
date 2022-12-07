import { DataSource, EntityTarget, QueryRunner, Repository } from 'typeorm'
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel'

import { Err, Result } from 'oxide.ts'
import { Logger, UnitOfWorkPort } from 'shared/application/ports'
import { Injectable } from '@nestjs/common'
import { ID } from 'shared/domain/value-objects'
import { Entity } from 'shared/domain/base-classes/entity.base'
import { TypeormEntityBase } from 'shared/infrastructure/database/base-classes/typeorm.entity.base'

@Injectable()
export class TypeormUnitOfWork implements UnitOfWorkPort {
  constructor(
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
  ) {}

  private queryRunners: Map<string, QueryRunner> = new Map()

  private getQueryRunner(correlationId: string): QueryRunner {
    const queryRunner = this.queryRunners.get(correlationId)
    if (!queryRunner) {
      throw new Error(
        'Query runner not found. Incorrect correlationId or transaction is not started. To start a transaction wrap operations in a "execute" method.',
      )
    }
    return queryRunner
  }

  getOrmRepository<
    TEntity extends TypeormEntityBase<ID, object, Entity<ID, object>>,
  >(entity: EntityTarget<TEntity>, correlationId: string): Repository<TEntity> {
    const queryRunner = this.getQueryRunner(correlationId)
    return queryRunner.manager.getRepository(entity)
  }

  async execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    options?: { isolationLevel: IsolationLevel },
  ): Promise<T> {
    if (!correlationId) {
      throw new Error('Correlation ID must be provided')
    }

    const queryRunner = this.dataSource.createQueryRunner()
    this.queryRunners.set(correlationId, queryRunner)
    this.logger.debug('[Starting DB transaction]')

    await queryRunner.startTransaction(options?.isolationLevel)
    let result: T | Result<T, Error>
    try {
      result = await callback()
      if ((result as unknown as Result<T, Error>)?.isErr()) {
        await this.rollbackTransaction<T>(
          correlationId,
          (result as unknown as Err<Error>).unwrapErr(),
        )
        return result
      }
    } catch (error) {
      await this.rollbackTransaction<T>(correlationId, error as Error)
      throw error
    }

    try {
      await queryRunner.commitTransaction()
    } finally {
      await this.finish(correlationId)
    }

    this.logger.debug('[DB Transaction committed]')

    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async rollbackTransaction<T>(correlationId: string, error: Error) {
    const queryRunner = this.getQueryRunner(correlationId)
    try {
      await queryRunner.rollbackTransaction()
      this.logger.debug(`[DB Transaction rolled back] ${error.message}`)
    } finally {
      await this.finish(correlationId)
    }
  }

  private async finish(correlationId: string): Promise<void> {
    const queryRunner = this.getQueryRunner(correlationId)
    try {
      await queryRunner.release()
    } finally {
      this.queryRunners.delete(correlationId)
    }
  }
}
