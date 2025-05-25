import { Either, left, right } from './either'

class CustomError extends Error {
  constructor() {
    super('Custom error occurred')
  }
}

function doSomething(result: boolean): Either<CustomError, string> {
  if (result) {
    return right('success')
  }

  return left(new CustomError())
}

describe('Either Type Test', () => {
  it('should return Right on success', () => {
    const result = doSomething(true)

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)

    if (result.isRight()) {
      expect(result.value).toBe('success')
    }
  })

  it('should return Left on failure', () => {
    const result = doSomething(false)

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(CustomError)
      expect(result.value.message).toBe('Custom error occurred')
    }
  })

})
