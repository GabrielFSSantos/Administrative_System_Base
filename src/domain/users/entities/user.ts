import { Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

import { CPF } from './value-objects/cpf'
import { PasswordHash } from './value-objects/password-hash'

export interface UserProps {
  cpf: CPF
  name: Name
  emailAddress: EmailAddress
  passwordHash: PasswordHash
  createdAt: Date
  updatedAt: Date | null
}

export class User extends Entity<UserProps> {
  get cpf(): CPF {
    return this.props.cpf
  }

  get name(): Name {
    return this.props.name
  }

  get emailAddress(): EmailAddress {
    return this.props.emailAddress
  }

  get passwordHash(): PasswordHash {
    return this.props.passwordHash
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  public changeName(newName: Name): void {
    this.props.name = newName
    this.touch()
  }

  public changeEmail(newEmailAddress: EmailAddress): void {
    this.props.emailAddress = newEmailAddress
    this.touch()
  }

  public changePasswordHash(newPasswordHash: PasswordHash): void {
    this.props.passwordHash = newPasswordHash
    this.touch()
  }

  static create(
    props: Optional<UserProps,  'createdAt' | 'updatedAt'>,
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
