import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  email: string
  password: string
  roleId: UniqueEntityId
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

  get roleId() {
    return this.props.roleId
  }
  
  set roleId(roleId: UniqueEntityId) {
    this.props.roleId = roleId
    this.touch()
  }

  get isActive() {
    return this.props.isActive
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

  public isCurrentlyActive() {
    return this.props.isActive !== null && this.props.isActive <= new Date()
  }

  public activate(): void {
    if (!this.isCurrentlyActive()) {
      this.props.isActive = new Date()
      this.touch()
    }
  }

  public deactivate(): void {
    if (this.isCurrentlyActive()) {
      this.props.isActive = null
      this.touch()
    }
  }

  public changePassword(newHashedPassword: string): void {
    this.props.password = newHashedPassword
    this.touch()
  }

  public getHashedPassword(): string {
    return this.props.password
  }

  static create(
    props: Optional<UserProps, 'isActive' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        isActive: props.isActive ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      }, 
      id,
    )

    return user
  }
}
