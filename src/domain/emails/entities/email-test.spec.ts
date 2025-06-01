import { makeEmail } from 'test/factories/emails/make-email'
import { generateBodyValueObject } from 'test/factories/emails/value-objects/make-body'
import { generateSubjectValueObject } from 'test/factories/emails/value-objects/make-subject'
import { generateTitleValueObject } from 'test/factories/emails/value-objects/make-title'
import { generateEmailValueObject } from 'test/factories/value-objects/make-email'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Email } from '@/domain/emails/entities/email'
import { InvalidSentAtError } from '@/domain/emails/entities/errors/invalid-sent-at-error'
import { Subject } from '@/domain/emails/entities/value-objects/subject'
import { EmailAddress } from '@/shared/value-objects/email-address'

import { Body } from './value-objects/body'
import { Title } from './value-objects/title'

describe('EmailEntityTest', () => {
  it('should create a valid Email with makeEmail()', () => {
    const email = makeEmail()

    expect(email).toBeInstanceOf(Email)
    expect(email.from).toBeInstanceOf(EmailAddress)
    expect(email.to).toBeInstanceOf(EmailAddress)
    expect(email.subject).toBeInstanceOf(Subject)
    expect(email.title).toBeInstanceOf(Title)
    expect(email.body).toBeInstanceOf(Body)
    expect(email.createdAt).toBeInstanceOf(Date)
    expect(email.sentAt).toBeNull()
  })

  it('should not create email if sentAt is before createdAt', () => {
    const createdAt = new Date('2025-01-02')
    const sentAt = new Date('2025-01-01')

    const result = Email.create({
      from: generateEmailValueObject(),
      to: generateEmailValueObject(),
      subject: generateSubjectValueObject(),
      title: generateTitleValueObject(),
      body: generateBodyValueObject(),
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
    const customSubject = generateSubjectValueObject()
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
