import { InvalidSubjectError } from './errors/invalid-subject-error'
import { Subject } from './subject'

describe('UserSubjectTest', () => {
  it('should create a valid Subject', () => {
    const result = Subject.create('Verify your account')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Subject)
    expect(result.value.toString()).toBe('Verify your account')
  })

  it('should return left if Subject is empty', () => {
    const result = Subject.create('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidSubjectError)
  })
})