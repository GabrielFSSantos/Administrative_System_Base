// tests/unit/entities/make-email.ts

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Email, EmailProps } from '@/domain/emails/entities/email'

import { generateEmailValueObject } from '../value-objects/make-email'

export function makeEmail(
  override: Partial<EmailProps> = {},
  id?: UniqueEntityId,
) {
  const to = override.to ?? generateEmailValueObject()
  const subject = override.subject ?? 'Default Subject'
  const title = override.title ?? 'Default Title'
  const body = override.body ?? 'Default body content.'
  const createdAt = override.createdAt ?? new Date()
  const sentAt = override.sentAt ?? null
  const actionLink = override.actionLink ?? null

  const emailOrError = Email.create(
    {
      to,
      subject,
      title,
      body,
      createdAt,
      sentAt,
      actionLink,
      ...override,
    },
    id,
  )

  if (emailOrError.isLeft()) {
    throw emailOrError.value
  }

  return emailOrError.value
}
