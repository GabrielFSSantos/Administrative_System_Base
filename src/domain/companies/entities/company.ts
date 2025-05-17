import { Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

import { CNPJ } from './value-objects/cnpj'

export interface CompanyProps {
  cnpj: CNPJ
  name: Name
  emailAddress: EmailAddress
  createdAt: Date
  updatedAt: Date | null
}

export class Company extends Entity<CompanyProps> {
  get cnpj(): CNPJ {
    return this.props.cnpj
  }

  get name(): Name {
    return this.props.name
  }

  get emailAddress(): EmailAddress {
    return this.props.emailAddress
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

  static create(
    props: Optional<CompanyProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ): Either<InvalidUpdatedAtError, Company> {
    const createdAt = props.createdAt ?? new Date()
    const updatedAt = props.updatedAt ?? null

    if (updatedAt && updatedAt < createdAt) {
      return left(new InvalidUpdatedAtError())
    }

    const company = new Company(
      {
        ...props,
        createdAt,
        updatedAt,
      },
      id,
    )

    return right(company)
  }
}
