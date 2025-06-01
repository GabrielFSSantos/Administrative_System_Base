import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'
import { ActivationStatus } from '@/shared/value-objects/activation-status/activation-status'
import { AlreadyActivatedError } from '@/shared/value-objects/activation-status/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/shared/value-objects/activation-status/errors/already-deactivated-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'
import { PermissionName } from '@/shared/value-objects/permission-name'
import { PermissionList } from '@/shared/watched-lists/permission-list/permission-list'

import { CompanyActivatedEvent } from '../events/company-activated-event'
import { CNPJ } from './value-objects/cnpj'

export interface CompanyProps {
  cnpj: CNPJ
  name: Name
  emailAddress: EmailAddress
  permissions: PermissionList
  activationStatus: ActivationStatus
  createdAt: Date
  updatedAt: Date | null
}

export class Company extends AggregateRoot<CompanyProps> {
  get cnpj(): CNPJ {
    return this.props.cnpj
  }

  get name(): Name {
    return this.props.name
  }

  get emailAddress(): EmailAddress {
    return this.props.emailAddress
  }

  get activationStatus(): ActivationStatus {
    return this.props.activationStatus
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

  public hasPermission(permissionName: PermissionName): boolean {
    return this.props.permissions.has(permissionName)
  }
  
  public updatePermissions(permissions: PermissionName[]): void {
    this.props.permissions.update(permissions)
  }

  public isActivated(): boolean {
    return this.props.activationStatus.isActive()
  }
  
  public activate(): Either<
      AlreadyActivatedError, 
      null
      > {
    if (this.isActivated()) {
      return left(new AlreadyActivatedError())
    }
  
    this.props.activationStatus = ActivationStatus.activated()

    this.addDomainEvent(CompanyActivatedEvent.create(this))
  
    return right(null)
  }
  
  public deactivate(): Either<
      AlreadyDeactivatedError, 
      null
      > {
    if (!this.isActivated()) {
      return left(new AlreadyDeactivatedError())
    }
  
    this.props.activationStatus = ActivationStatus.deactivated()
  
    return right(null)
  }

  static create(
    props: Optional<CompanyProps, 
    'permissions' | 'activationStatus'
    | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ): Either<InvalidUpdatedAtError, Company> {

    const createdAt = props.createdAt ?? new Date()
    const updatedAt = props.updatedAt ?? null

    if (updatedAt && updatedAt < createdAt) {
      return left(new InvalidUpdatedAtError())
    }

    const activationStatus = props.activationStatus ?? ActivationStatus.deactivated()
    const permissionList = props.permissions ?? PermissionList.create()

    const company = new Company(
      {
        cnpj: props.cnpj,
        name: props.name,
        emailAddress: props.emailAddress,
        permissions: permissionList,
        activationStatus,
        createdAt,
        updatedAt,
      },
      id,
    )

    return right(company)
  }
}
