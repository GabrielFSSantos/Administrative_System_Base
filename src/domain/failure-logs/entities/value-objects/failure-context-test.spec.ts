import { InvalidFailureContextError } from './errors/invalid-failure-context-error'
import { FailureContext } from './failure-context'

describe('FailureContextValueObjectTest', () => {
  it('should create a valid FailureContext object', () => {
    const result = FailureContext.create('SomeContext')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('SomeContext')
  })

  it('should trim and create a valid FailureContext', () => {
    const result = FailureContext.create('   Context With Space   ')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('Context With Space')
  })

  it('should return error for empty context', () => {
    const result = FailureContext.create('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidFailureContextError)
  })

  it('should return error for whitespace-only context', () => {
    const result = FailureContext.create('    ')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidFailureContextError)
  })
})