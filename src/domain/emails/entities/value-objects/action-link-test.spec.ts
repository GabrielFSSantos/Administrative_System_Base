import { ActionLink } from './action-link'
import { InvalidActionLinkError } from './errors/invalid-action-link-error'

describe('UserActionLinkTest', () => {
  it('should create a valid ActionLink', () => {
    const result = ActionLink.create('https://example.com/confirm')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(ActionLink)
    expect(result.value.toString()).toBe('https://example.com/confirm')
  })

  it('should return left if ActionLink is invalid', () => {
    const result = ActionLink.create('invalid-url')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidActionLinkError)
  })
})