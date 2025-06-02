import { EmailAddress } from './email-address'
import { InvalidEmailAddressError } from './errors/invalid-email-address-error'

describe('EmailAddressValueObjectTest', () => {
  it('should create a valid email object', () => {
    const result = EmailAddress.create('user@example.com')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAddress)
    expect(result.value.toString()).toBe('user@example.com')
  })

  it('should normalize spaces and uppercase letters', () => {
    const result = EmailAddress.create('  UsEr@ExAmple.Com  ')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('user@example.com')
  })

  it('should return error for email without "@"', () => {
    const result = EmailAddress.create('invalidemail.com')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
  })

  it('should return error for email with invalid domain', () => {
    const result = EmailAddress.create('user@localhost')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
  })

  it('should return error for email that is too short', () => {
    const result = EmailAddress.create('a@b')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
  })

  it('should return error for email that is too long', () => {
    const longEmail = 'a'.repeat(250) + '@test.com'
    const result = EmailAddress.create(longEmail)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
  })

  it('should compare email equality based on normalized value', () => {
    const emailA = EmailAddress.create('TEST@Email.com')
    const emailB = EmailAddress.create('test@email.com')

    expect(emailA.isRight()).toBe(true)
    expect(emailB.isRight()).toBe(true)

    if (emailA.isRight() && emailB.isRight()) {
      expect(emailA.value.equals(emailB.value)).toBe(true)
    }
  })
})
