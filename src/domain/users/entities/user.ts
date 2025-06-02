import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Locale } from '@/shared/value-objects/locale/locale'
import { Name } from '@/shared/value-objects/name'

import { UserPasswordChangedEvent } from '../events/user-password-changed-event'
import { CPF } from './value-objects/cpf'
import { PasswordHash } from './value-objects/password-hash'

export interface UserProps {
  name: Name
  emailAddress: EmailAddress
  cpf: CPF
  passwordHash: PasswordHash
  locale: Locale
  createdAt: Date
  updatedAt: Date | null
}

export class User extends AggregateRoot<UserProps> {
  get name() {
    return this.props.name
  }

  get emailAddress() {
    return this.props.emailAddress
  }

  get cpf() {
    return this.props.cpf
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get locale() {
    return this.props.locale
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  public changeName(name: Name) {
    this.props.name = name
    this.touch()
  }

  public changeEmail(email: EmailAddress) {
    this.props.emailAddress = email
    this.touch()
  }

  public changeLocale(locale: Locale) {
    this.props.locale = locale
    this.touch()
  }

  public changePasswordHash(newPasswordHash: PasswordHash): void {
    this.props.passwordHash = newPasswordHash
    this.touch()

    this.addDomainEvent(UserPasswordChangedEvent.create(this))
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ): Either<
      InvalidUpdatedAtError,
      User
    > {
    const createdAt = props.createdAt ?? new Date()
    const updatedAt = props.updatedAt ?? null

    if (updatedAt && updatedAt < createdAt) {
      return left(new InvalidUpdatedAtError())
    }

    const user = new User(
      {
        ...props,
        createdAt,
        updatedAt,
      },
      id,
    )

    return right(user)
  }
}
