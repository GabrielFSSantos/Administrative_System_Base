import { CreateEmailContract } from '@/domain/emails/use-cases/contracts/create-email-contract'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { InvalidEmailAddressError } from '@/shared/value-objects/errors/invalid-email-address-error'

describe('Create Email Use Case Tests', () => {
  let sut: CreateEmailContract

  beforeEach(() => {
    sut = new CreateEmailUseCase()
  })

  it('should create a valid email', async () => {
    const result = await sut.execute({
      to: 'user@example.com',
      subject: 'Test Subject',
      title: 'Test Title',
      body: 'Test Body',
      actionLink: 'https://example.com',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const email = result.value.email

      expect(email.to.toString()).toBe('user@example.com')
      expect(email.subject).toBe('Test Subject')
      expect(email.title).toBe('Test Title')
      expect(email.body).toBe('Test Body')
      expect(email.actionLink).toBe('https://example.com')
    }
  })

  it('should return InvalidEmailError for invalid email address', async () => {
    const result = await sut.execute({
      to: 'invalid-email',
      subject: 'Invalid Email Test',
      title: 'Invalid Title',
      body: 'Invalid Body',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
    }
  })

})
