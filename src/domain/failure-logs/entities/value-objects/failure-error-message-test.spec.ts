import { InvalidErrorMessageError } from './errors/invalid-error-message-error'
import { FailureErrorMessage } from './failure-error-message'

describe('FailureErrorMessageValueObjectTest', () => {
  it('should create a valid FailureErrorMessage object', () => {
    const result = FailureErrorMessage.create('Something went wrong.')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('Something went wrong.')
  })

  it('should trim and create a valid FailureErrorMessage', () => {
    const result = FailureErrorMessage.create('  Trimmed message  ')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('Trimmed message')
  })

  it('should return error for empty message', () => {
    const result = FailureErrorMessage.create('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidErrorMessageError)
  })

  it('should return error for whitespace-only message', () => {
    const result = FailureErrorMessage.create('   ')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidErrorMessageError)
  })
})