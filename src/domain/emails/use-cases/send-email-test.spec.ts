import { makeEmail } from 'test/factories/emails/make-email'
import { FakeEmailService } from 'test/fakes/emails/fake-send-email'

import { SendEmailContract } from '@/domain/emails/use-cases/contracts/send-email-contract'
import { SendEmailError } from '@/domain/emails/use-cases/errors/send-email-error'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'

let fakeEmailService: FakeEmailService
let sut: SendEmailContract

describe('SendEmailUseCaseTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    sut = new SendEmailUseCase(fakeEmailService)
  })

  it('should send an email successfully and mark it as sent', async () => {
    const email = makeEmail()

    const result = await sut.execute({ email })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.email.sentAt).toBeInstanceOf(Date)
    }
  })

  it('should return SendEmailError if email sending fails', async () => {
    const email = makeEmail()

    fakeEmailService.shouldFail = true

    const result = await sut.execute({ email })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SendEmailError)
    }
  })

  it('should preserve existing sentAt if already set', async () => {
    const sentDate = new Date('2024-01-01T10:00:00Z')
    const createdAt = new Date('2023-12-31T23:59:59Z')

    const email = makeEmail({ createdAt, sentAt: sentDate })

    const result = await sut.execute({ email })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.email.sentAt).not.toEqual(sentDate)
      expect(result.value.email.sentAt).toBeInstanceOf(Date)
    }
  })

})
