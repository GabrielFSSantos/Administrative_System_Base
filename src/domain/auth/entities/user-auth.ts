import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface UserAuthProps {
  email: string
  password: string
  role: string
  isActive: boolean
}

export class UserAuth extends Entity<UserAuthProps> {

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  static create(props: UserAuthProps, id?: UniqueEntityId) {
    const userauth = new UserAuth(props, id)

    return userauth
  }
}
