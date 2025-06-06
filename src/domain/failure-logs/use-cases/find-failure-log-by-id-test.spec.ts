import { makeFailureLog } from 'test/factories/failure-logs/make-failure-logs'
import { InMemoryFailureLogsRepository } from 'test/repositories/in-memory-failure-logs-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { FindFailureLogByIdContract } from './contracts/find-failure-log-by-id-contract'
import { FindFailureLogByIdUseCase } from './find-failure-log-by-id-use-case'

let failureLogsRepository: InMemoryFailureLogsRepository
let sut: FindFailureLogByIdContract

describe('FindFailureLogByIdUseCaseTest', () => {
  beforeEach(() => {
    failureLogsRepository = new InMemoryFailureLogsRepository()
    sut = new FindFailureLogByIdUseCase(failureLogsRepository)
  })

  it('should retrieve a failure log by valid id', async () => {
    const failureLog = await makeFailureLog()

    await failureLogsRepository.create(failureLog)

    const result = await sut.execute({ failureLogId: failureLog.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.failureLog.id.toString()).toBe(failureLog.id.toString())
      expect(result.value.failureLog.context.value).toBe(failureLog.context.value)
      expect(result.value.failureLog.errorName.value).toBe(failureLog.errorName.value)
      expect(result.value.failureLog.errorMessage.value).toBe(failureLog.errorMessage.value)
    }
  })

  it('should return error if failure log does not exist', async () => {
    const result = await sut.execute({ failureLogId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should call repository with correct id', async () => {
    const failureLog = await makeFailureLog()

    await failureLogsRepository.create(failureLog)

    const spy = vi.spyOn(failureLogsRepository, 'findById')

    await sut.execute({ failureLogId: failureLog.id.toString() })

    expect(spy).toHaveBeenCalledWith(failureLog.id.toString())
  })

  it('should not retrieve a failure log after deletion', async () => {
    const failureLog = await makeFailureLog()

    await failureLogsRepository.create(failureLog)
    await failureLogsRepository.delete(failureLog.id.toString())

    const result = await sut.execute({ failureLogId: failureLog.id.toString() })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
