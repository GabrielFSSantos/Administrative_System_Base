import { DomainError } from '@/core/errors/domain-error'

export class MemberAlreadyExistsError extends Error implements DomainError {
  constructor(recipientId: string, companyId: string) {
    super(
      `A member with recipientId "${recipientId}" already exists in company "${companyId}".`,
    )
  }
}
