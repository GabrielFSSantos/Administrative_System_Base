import { Either, left, right } from './either'

function doSomething(result: boolean): Either<string, string> {
  if (result) {
    return right('success')
  }

  return left('error')
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isRight()).toBe(false)
  expect(result.isLeft()).toBe(true)
})
