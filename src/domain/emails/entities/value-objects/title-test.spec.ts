import { InvalidTitleError } from './errors/invalid-title-error'
import { Title } from './title'

describe('UserTitleTest', () => {
  it('should create a valid Title', () => {
    const result = Title.create('Account Activation')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Title)
    expect(result.value.toString()).toBe('Account Activation')
  })

  it('should return left if Title is empty', () => {
    const result = Title.create('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTitleError)
  })
})