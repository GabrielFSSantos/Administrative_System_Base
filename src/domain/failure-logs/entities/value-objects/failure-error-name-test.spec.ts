import { InvalidErrorNameError } from './errors/invalid-error-name-error'
import { FailureErrorName } from './failure-error-name'

describe('FailureErrorNameValueObjectTest', () => {
  it('should create a valid FailureErrorName object', () => {
    const result = FailureErrorName.create('SomeError')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('SomeError')
  })

  it('should trim and create a valid FailureErrorName', () => {
    const result = FailureErrorName.create('   Error Name   ')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('Error Name')
  })

  it('should return error for empty name', () => {
    const result = FailureErrorName.create('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidErrorNameError)
  })

  it('should return error for whitespace-only name', () => {
    const result = FailureErrorName.create('   ')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidErrorNameError)
  })
})