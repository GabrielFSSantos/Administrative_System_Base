import { DomainError } from '@/core/errors/domain-error'

export class SystemAdminAlreadyExistsError extends Error implements DomainError {
  constructor(recipientId: string) {
    super(
      `A system admin with recipientId "${recipientId}" already exists".`,
    )
  }
}
