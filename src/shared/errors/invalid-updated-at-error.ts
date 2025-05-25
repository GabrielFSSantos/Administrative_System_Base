import { DomainError } from '@/core/errors/domain-error'

export class InvalidUpdatedAtError extends Error implements DomainError {
  constructor() {
    super('The updatedAt date cannot be earlier than createdAt.')
  }
}
