import { makeEmail } from 'test/factories/emails/make-email'
import { generateEmailValueObject } from 'test/factories/value-objects/make-email'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Email } from '@/domain/emails/entities/email'
import { InvalidSentAtError } from '@/domain/emails/entities/errors/invalid-sent-at-error'

describe('Email Entity Test', () => {
  it('should create a valid Email with makeEmail()', () => {
    const email = makeEmail()

    expect(email).toBeInstanceOf(Email)
    expect(email.to).toBeDefined()
    expect(email.subject).toBeDefined()
    expect(email.title).toBeDefined()
    expect(email.body).toBeDefined()
    expect(email.sentAt).toBeNull()
    expect(email.createdAt).toBeInstanceOf(Date)
  })

  it('should not create email if sentAt is before createdAt', () => {
    const createdAt = new Date('2025-01-02')
    const sentAt = new Date('2025-01-01')

    const result = Email.create({
      to: generateEmailValueObject(),
      subject: 'Invalid SentAt',
      title: 'Invalid SentAt',
      body: 'Invalid SentAt',
      createdAt,
      sentAt,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidSentAtError)
  })

  it('should set createdAt and sentAt correctly if not provided', () => {
    const email = makeEmail()

    expect(email.createdAt).toBeInstanceOf(Date)
    expect(email.sentAt).toBeNull()
  })

  it('should allow overriding properties with makeEmail()', () => {
    const customSubject = 'Custom Subject'
    const email = makeEmail({ subject: customSubject })

    expect(email.subject).toBe(customSubject)
  })

  it('should mark email as sent', () => {
    const email = makeEmail()

    expect(email.sentAt).toBeNull()

    email.markAsSent()

    expect(email.sentAt).toBeInstanceOf(Date)
  })

  it('should preserve provided UniqueEntityId', () => {
    const customId = UniqueEntityId.create()
    const email = makeEmail({}, customId)

    expect(email.id).toEqual(customId)
  })
})
