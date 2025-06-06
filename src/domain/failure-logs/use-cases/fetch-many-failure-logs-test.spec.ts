import { makeFailureLog } from 'test/factories/failure-logs/make-failure-logs'
import { generateFailureContextValueObject } from 'test/factories/failure-logs/value-objects/make-failure-context'
import { InMemoryFailureLogsRepository } from 'test/repositories/in-memory-failure-logs-repository'
import { vi } from 'vitest'

import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { FetchManyFailureLogsContract } from './contracts/fetch-many-failure-logs-contract'
import { FetchManyFailureLogsUseCase } from './fetch-many-failure-logs-use-case'

let failureLogsRepository: InMemoryFailureLogsRepository
let sut: FetchManyFailureLogsContract

describe('FetchManyFailureLogsUseCaseTest', () => {
  beforeEach(() => {
    failureLogsRepository = new InMemoryFailureLogsRepository()
    sut = new FetchManyFailureLogsUseCase(failureLogsRepository)
  })

  it('should fetch up to limit failure logs', async () => {
    for (let i = 0; i < 25; i++) {
      const log = await makeFailureLog()

      await failureLogsRepository.create(log)
    }

    const result = await sut.execute({ limit: 20, offset: 0 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.failureLog).toHaveLength(20)
      expect(result.value.total).toBe(25)
    }
  })

  it('should return correct page of failure logs based on offset', async () => {
    for (let i = 0; i < 30; i++) {
      const log = await makeFailureLog()

      await failureLogsRepository.create(log)
    }

    const result = await sut.execute({ limit: 10, offset: 10 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.failureLog).toHaveLength(10)
    }
  })

  it('should return empty list if no failure logs exist', async () => {
    const result = await sut.execute({ limit: 10, offset: 0 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.failureLog).toHaveLength(0)
      expect(result.value.total).toBe(0)
    }
  })

  it('should call repository with correct parameters', async () => {
    const spy = vi.spyOn(failureLogsRepository, 'findMany')

    await sut.execute({ limit: 10, offset: 20 })

    expect(spy).toHaveBeenCalledWith({
      limit: 10,
      offset: 20,
      context: undefined,
      startDate: undefined,
      endDate: undefined,
    })
  })

  it('should return error when limit is less than 1', async () => {
    const result = await sut.execute({ limit: 0, offset: 0 })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should return error when offset is negative', async () => {
    const result = await sut.execute({ limit: 10, offset: -1 })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should filter logs based on context', async () => {
    const matchingLog = await makeFailureLog({
      context: generateFailureContextValueObject('AUTH_MODULE'),
    })
    const otherLog = await makeFailureLog({
      context: generateFailureContextValueObject('NOTIFICATION_MODULE'),
    })

    await failureLogsRepository.create(matchingLog)
    await failureLogsRepository.create(otherLog)

    const result = await sut.execute({
      limit: 10,
      offset: 0,
      context: 'AUTH_MODULE',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.failureLog).toHaveLength(1)
      expect(result.value.failureLog[0].context.value).toBe('AUTH_MODULE')
    }
  })

  it('should filter logs based on date range', async () => {
    const oldDate = new Date('2024-01-01')
    const recentDate = new Date('2025-01-01')

    const oldLog = await makeFailureLog({ createdAt: oldDate })
    const recentLog = await makeFailureLog({ createdAt: recentDate })

    await failureLogsRepository.create(oldLog)
    await failureLogsRepository.create(recentLog)

    const result = await sut.execute({
      limit: 10,
      offset: 0,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-12-31'),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.failureLog).toHaveLength(1)
      expect(result.value.failureLog[0].createdAt).toEqual(recentDate)
    }
  })
})
