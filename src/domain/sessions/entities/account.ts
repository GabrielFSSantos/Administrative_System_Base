import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AccountProps {
  email: string
  password: string
  role: string
  isActive: Date | null
}

export class Account extends Entity<AccountProps> {

  get email() {
    return this.props.email
  }

  get role() {
    return this.props.role
  }

  get isActive() {
    return this.props.isActive
  }

  public isCurrentlyActive() {
    return this.props.isActive !== null && this.props.isActive <= new Date()
  }

  public getHashedPassword(): string {
    return this.props.password
  }

  static create(props: AccountProps, id?: UniqueEntityId) {
    const account = new Account(props, id)

    return account
  }
}
