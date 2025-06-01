import { DomainError } from '@/core/errors/domain-error'

export class MemberAlreadyExistsError extends Error implements DomainError {
  constructor(recipientId: string, ownerId: string) {
    super(
      `A member with recipientId "${recipientId}" already exists in owner "${ownerId}".`,
    )
  }
}
