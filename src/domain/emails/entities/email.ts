import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { EmailAddress } from '@/shared/value-objects/email-address'

import { InvalidSentAtError } from './errors/invalid-sent-at-error'

export interface EmailProps {
  to: EmailAddress
  subject: string
  title: string
  body: string
  actionLink?: string | null
  createdAt: Date
  sentAt?: Date | null
}

export class Email extends AggregateRoot<EmailProps> {
  get to(): EmailAddress {
    return this.props.to
  }

  get subject(): string {
    return this.props.subject
  }

  get title(): string {
    return this.props.title
  }

  get body(): string {
    return this.props.body
  }

  get actionLink(): string | null | undefined {
    return this.props.actionLink
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get sentAt(): Date | null | undefined {
    return this.props.sentAt
  }

  public markAsSent(): void {
    this.props.sentAt = new Date()
  }

  static create(
    props: Optional<EmailProps, 'createdAt' | 'sentAt' | 'actionLink'>,
    id?: UniqueEntityId,
  ): Either<InvalidSentAtError, Email> {
    const createdAt = props.createdAt ?? new Date()
    const sentAt = props.sentAt ?? null

    if (sentAt && sentAt < createdAt) {
      return left(new InvalidSentAtError())
    }

    const email = new Email(
      {
        ...props,
        createdAt,
        sentAt,
        actionLink: props.actionLink ?? null,
      },
      id,
    )

    return right(email)
  }
}
