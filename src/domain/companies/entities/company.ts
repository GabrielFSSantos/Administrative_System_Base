import { Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'
import { Name } from '@/shared/value-objects/name'

import { CNPJ } from './value-objects/cnpj'

export interface CompanyProps {
  cnpj: CNPJ
  name: Name
  createdAt: Date
  updatedAt: Date | null
  isActive: boolean
}

export class Company extends Entity<CompanyProps> {
  get cnpj(): CNPJ {
    return this.props.cnpj
  }

  get name(): Name {
    return this.props.name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  public activate(): void {
    if (!this.props.isActive) {
      this.props.isActive = true
      this.touch()
    }
  }

  public deactivate(): void {
    if (this.props.isActive) {
      this.props.isActive = false
      this.touch()
    }
  }

  public changeName(newName: Name): void {
    this.props.name = newName
    this.touch()
  }

  static create(
    props: Optional<CompanyProps, 'createdAt' | 'updatedAt' | 'isActive'>,
    id?: UniqueEntityId,
  ): Either<InvalidUpdatedAtError, Company> {
    const createdAt = props.createdAt ?? new Date()
    const updatedAt = props.updatedAt ?? null
    const isActive = props.isActive ?? true

    if (updatedAt && updatedAt < createdAt) {
      return left(new InvalidUpdatedAtError())
    }

    const company = new Company(
      {
        ...props,
        createdAt,
        updatedAt,
        isActive,
      },
      id,
    )

    return right(company)
  }
}
