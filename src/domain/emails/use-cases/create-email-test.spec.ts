import { Email } from '@/domain/emails/entities/email'
import { CreateEmailContract } from '@/domain/emails/use-cases/contracts/create-email-contract'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { InvalidEmailAddressError } from '@/shared/value-objects/errors/invalid-email-address-error'

import { InvalidActionLinkError } from '../entities/value-objects/errors/invalid-action-link-error'
import { InvalidBodyError } from '../entities/value-objects/errors/invalid-body-error'
import { InvalidSubjectError } from '../entities/value-objects/errors/invalid-subject-error'
import { InvalidTitleError } from '../entities/value-objects/errors/invalid-title-error'

let sut: CreateEmailContract

describe('CreateEmailUseCaseTest', () => {
  beforeEach(() => {
    sut = new CreateEmailUseCase()
  })

  it('should create a valid email', async () => {
    const result = await sut.execute({
      to: 'user@example.com',
      from: 'admin@example.com',
      subject: 'Welcome',
      title: 'Welcome Title',
      body: 'This is the body content.',
      actionLink: 'https://example.com/confirm',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const email = result.value.email

      expect(email).toBeInstanceOf(Email)
      expect(email.to.toString()).toBe('user@example.com')
      expect(email.from.toString()).toBe('admin@example.com')
      expect(email.subject.value).toBe('Welcome')
      expect(email.title.value).toBe('Welcome Title')
      expect(email.body.value).toBe('This is the body content.')
      expect(email.actionLink?.value).toBe('https://example.com/confirm')
    }
  })

  it('should reject invalid email in "to" field', async () => {
    const result = await sut.execute({
      to: 'invalid-email',
      from: 'admin@example.com',
      subject: 'Subject',
      title: 'Title',
      body: 'Body',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
  })

  it('should reject invalid email in "from" field', async () => {
    const result = await sut.execute({
      to: 'user@example.com',
      from: 'invalid-email',
      subject: 'Subject',
      title: 'Title',
      body: 'Body',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
  })

  it('should reject invalid subject', async () => {
    const result = await sut.execute({
      to: 'user@example.com',
      from: 'admin@example.com',
      subject: '',
      title: 'Valid Title',
      body: 'Valid body',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidSubjectError)
  })

  it('should reject invalid title', async () => {
    const result = await sut.execute({
      to: 'user@example.com',
      from: 'admin@example.com',
      subject: 'Valid Subject',
      title: '',
      body: 'Valid body',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTitleError)
  })

  it('should reject invalid body', async () => {
    const result = await sut.execute({
      to: 'user@example.com',
      from: 'admin@example.com',
      subject: 'Valid Subject',
      title: 'Valid Title',
      body: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidBodyError)
  })

  it('should reject invalid actionLink if provided', async () => {
    const result = await sut.execute({
      to: 'user@example.com',
      from: 'admin@example.com',
      subject: 'Valid Subject',
      title: 'Valid Title',
      body: 'Valid body',
      actionLink: 'not-a-url',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidActionLinkError)
  })
})
