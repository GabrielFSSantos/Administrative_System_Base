import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Email, EmailProps } from '@/domain/emails/entities/email'

import { generateEmailValueObject } from '../value-objects/make-email'
import { generateBodyValueObject } from './value-objects/make-body'
import { generateSubjectValueObject } from './value-objects/make-subject'
import { generateTitleValueObject } from './value-objects/make-title'

export function makeEmail(
  override: Partial<EmailProps> = {},
  id?: UniqueEntityId,
) {
  const from = override.from ?? generateEmailValueObject()
  const to = override.to ?? generateEmailValueObject()
  const subject = override.subject ?? generateSubjectValueObject()
  const title = override.title ?? generateTitleValueObject()
  const body = override.body ?? generateBodyValueObject()
  const actionLink = override.actionLink ?? null
  const createdAt = override.createdAt ?? new Date()
  const sentAt = override.sentAt ?? null

  const emailOrError = Email.create(
    {
      from,
      to,
      subject,
      title,
      body,
      actionLink,
      createdAt,
      sentAt,
      ...override,
    },
    id,
  )

  if (emailOrError.isLeft()) {
    throw emailOrError.value
  }

  return emailOrError.value
}
