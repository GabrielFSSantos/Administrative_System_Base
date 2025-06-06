import { makeFailureLog } from 'test/factories/failure-logs/make-failure-logs'
import { InMemoryFailureLogsRepository } from 'test/repositories/in-memory-failure-logs-repository'
import { vi } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { DeleteFailureLogContract } from './contracts/delete-failure-log-contract'
import { DeleteFailureLogUseCase } from './delete-failure-log-use-case'

let inMemoryFailureLogsRepository: InMemoryFailureLogsRepository
let sut: DeleteFailureLogContract

describe('DeleteFailureLogUseCaseTest', () => {
  beforeEach(() => {
    inMemoryFailureLogsRepository = new InMemoryFailureLogsRepository()
    sut = new DeleteFailureLogUseCase(inMemoryFailureLogsRepository)
  })

  it('should delete a failure log by ID', async () => {
    const failureLog = await makeFailureLog()

    await inMemoryFailureLogsRepository.create(failureLog)

    const result = await sut.execute({ failureLogId: failureLog.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryFailureLogsRepository.items).toHaveLength(0)
  })

  it('should return ResourceNotFoundError if failure log does not exist', async () => {
    const result = await sut.execute({ failureLogId: UniqueEntityId.create().toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.delete with the correct failure log ID', async () => {
    const failureLog = await makeFailureLog()

    await inMemoryFailureLogsRepository.create(failureLog)

    const deleteSpy = vi.spyOn(inMemoryFailureLogsRepository, 'delete')

    await sut.execute({ failureLogId: failureLog.id.toString() })

    expect(deleteSpy).toHaveBeenCalledWith(failureLog.id.toString())
  })

  it('should preserve other logs after deletion', async () => {
    const log1 = await makeFailureLog()
    const log2 = await makeFailureLog()

    await inMemoryFailureLogsRepository.create(log1)
    await inMemoryFailureLogsRepository.create(log2)

    await sut.execute({ failureLogId: log1.id.toString() })

    expect(inMemoryFailureLogsRepository.items).toHaveLength(1)
    expect(inMemoryFailureLogsRepository.items[0].id.toString()).toBe(log2.id.toString())
  })

  it('should not find failure log after it is deleted', async () => {
    const failureLog = await makeFailureLog()

    await inMemoryFailureLogsRepository.create(failureLog)

    await sut.execute({ failureLogId: failureLog.id.toString() })

    const result = await inMemoryFailureLogsRepository.findById(failureLog.id.toString())

    expect(result).toBeNull()
  })

  it('should not throw when trying to delete failure log twice', async () => {
    const failureLog = await makeFailureLog()

    await inMemoryFailureLogsRepository.create(failureLog)

    await sut.execute({ failureLogId: failureLog.id.toString() })
    const result = await sut.execute({ failureLogId: failureLog.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
