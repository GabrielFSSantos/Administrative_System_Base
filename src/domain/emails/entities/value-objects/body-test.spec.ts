
import { Body } from './body'
import { InvalidBodyError } from './errors/invalid-body-error'

describe('UserBodyTest', () => {
  it('should create a valid Body', () => {
    const result = Body.create('Welcome to our platform!')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Body)
    expect(result.value.toString()).toBe('Welcome to our platform!')
  })

  it('should return left if Body is empty', () => {
    const result = Body.create('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidBodyError)
  })
})