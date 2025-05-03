import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  email: string
  password: string
  role: string
  isActive: Date | null
  createdAt: Date
  updatedAt: Date | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }
  
  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get password() {
    return this.props.password
  }
  
  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get role() {
    return this.props.role
  }
  
  set role(role: string) {
    this.props.role = role
    this.touch()
  }

  get isActive() {
    return this.props.isActive
  }

  toggleActivation(isActive: boolean) {
    this.props.isActive = isActive ? new Date() : null
    this.touch()
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

  static create(
    props: Optional<UserProps, 'isActive' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        isActive: null,
        createdAt: new Date(),
        updatedAt: null,
      }, 
      id,
    )

    return user
  }
}
