
import { InMemoryFailureLogsRepository } from 'test/repositories/in-memory-failure-logs-repository'

import { InvalidErrorMessageError } from '@/domain/failure-logs/entities/value-objects/errors/invalid-error-message-error'
import { InvalidErrorNameError } from '@/domain/failure-logs/entities/value-objects/errors/invalid-error-name-error'
import { InvalidFailureContextError } from '@/domain/failure-logs/entities/value-objects/errors/invalid-failure-context-error'
import { CreateFailureLogContract } from '@/domain/failure-logs/use-cases/contracts/create-failure-log-contract'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'

let inMemoryFailureLogsRepository: InMemoryFailureLogsRepository
let sut: CreateFailureLogContract

describe('CreateFailureLogUseCaseTest', () => {
  beforeEach(() => {
    inMemoryFailureLogsRepository = new InMemoryFailureLogsRepository()
    sut = new CreateFailureLogUseCase(inMemoryFailureLogsRepository)
  })

  it('should create a failure log with valid data', async () => {
    const result = await sut.execute({
      context: 'UserModule',
      errorName: 'UserNotFoundError',
      errorMessage: 'User with given ID not found',
      payload: { userId: '123' },
      stack: 'stack trace example',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.failureLog).toEqual(inMemoryFailureLogsRepository.items[0])
    }
  })

  it('should store value objects correctly', async () => {
    await sut.execute({
      context: 'AuthModule',
      errorName: 'InvalidTokenError',
      errorMessage: 'The provided token is invalid',
    })

    const log = inMemoryFailureLogsRepository.items[0]

    expect(log.context.value).toBe('AuthModule')
    expect(log.errorName.value).toBe('InvalidTokenError')
    expect(log.errorMessage.value).toBe('The provided token is invalid')
  })

  it('should return error if context is empty', async () => {
    const result = await sut.execute({
      context: '',
      errorName: 'SomeError',
      errorMessage: 'Something went wrong',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidFailureContextError)
  })

  it('should return error if error name is empty', async () => {
    const result = await sut.execute({
      context: 'ContextModule',
      errorName: '',
      errorMessage: 'Something went wrong',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidErrorNameError)
  })

  it('should return error if error message is empty', async () => {
    const result = await sut.execute({
      context: 'ContextModule',
      errorName: 'ErrorName',
      errorMessage: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidErrorMessageError)
  })
})
