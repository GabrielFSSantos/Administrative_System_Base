import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface SessionProps {
  recipientId: UniqueEntityId
  token: string
  createdAt: Date
  expiresAt: Date
  revokedAt: Date | null
}

export class Session extends Entity<SessionProps> {

  get recipientId() {
    return this.props.recipientId
  }

  get token() {
    return this.props.token
  }

  get createdAt() {
    return this.props.createdAt
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get revokedAt() {
    return this.props.revokedAt
  }

  public belongsTo(recipientId: string) {
    return this.props.recipientId.toString() !== recipientId
  }

  public isRevoked() {
    return this.props.revokedAt !== null
  }

  public isExpired(): boolean {
    return this.props.expiresAt < new Date()
  }

  public isValid(): boolean {
    return !this.isRevoked() && !this.isExpired()
  }

  public revoke() {
    if (!this.isRevoked()) {
      this.props.revokedAt = new Date()
    }
  }

  static create(
    props: Optional<SessionProps, 'createdAt' | 'revokedAt'>,
    id?: UniqueEntityId,
  ) {

    const session = new Session(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        revokedAt: props.revokedAt ?? null,
      }, 
      id,
    )

    return session
  }
}
