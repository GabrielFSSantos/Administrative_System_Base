import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { InvalidSessionDateExpiredError } from './errors/invalid-session-date-expired-error-error'
import { InvalidSessionDateRevokedError } from './errors/invalid-session-date-revoked-error-error'
import { SessionAlreadyRevokedError } from './errors/session-already-revoked-error'
import { AccessToken } from './value-objects/access-token'

export interface SessionProps {
  recipientId: UniqueEntityId
  accessToken: AccessToken
  createdAt: Date
  expiresAt: Date
  revokedAt: Date | null
}

export class Session extends Entity<SessionProps> {
  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  get accessToken(): AccessToken {
    return this.props.accessToken
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get expiresAt(): Date {
    return this.props.expiresAt
  }
  
  public belongsTo(recipientId: string) {
    return this.props.recipientId.toString() === recipientId
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

  public revoke(): void {
    if (this.isRevoked()) {
      throw new SessionAlreadyRevokedError()
    }
  
    this.props.revokedAt = new Date()
  }

  static create(
    props: Optional<SessionProps, 'createdAt' | 'revokedAt'>,
    id?: UniqueEntityId,
  ) {

    const createdAt = props.createdAt ?? new Date()
    const revokedAt = props.revokedAt ?? null
  
    if (props.expiresAt < createdAt) {
      throw new InvalidSessionDateExpiredError()
    }

    if (revokedAt && revokedAt < createdAt) {
      throw new InvalidSessionDateRevokedError()
    }    
  
    const session = new Session(
      {
        ...props,
        createdAt,
        revokedAt,
      }, 
      id,
    )

    return session
  }
}
