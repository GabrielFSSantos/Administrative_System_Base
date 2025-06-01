import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ActionLink } from '@/domain/emails/entities/value-objects/action-link'
import { Body } from '@/domain/emails/entities/value-objects/body'
import { Subject } from '@/domain/emails/entities/value-objects/subject'
import { Title } from '@/domain/emails/entities/value-objects/title'
import { EmailAddress } from '@/shared/value-objects/email-address'

import { InvalidSentAtError } from './errors/invalid-sent-at-error'

export interface EmailProps {
  from: EmailAddress
  to: EmailAddress
  subject: Subject
  title: Title
  body: Body
  actionLink?: ActionLink | null
  createdAt: Date
  sentAt?: Date | null
}

export class Email extends AggregateRoot<EmailProps> {
  get from(): EmailAddress {
    return this.props.from
  }

  get to(): EmailAddress {
    return this.props.to
  }

  get subject(): Subject {
    return this.props.subject
  }

  get title(): Title {
    return this.props.title
  }

  get body(): Body {
    return this.props.body
  }

  get actionLink(): ActionLink | null | undefined {
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
