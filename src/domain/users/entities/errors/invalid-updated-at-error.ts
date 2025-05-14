import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidUpdatedAtError extends Error implements UseCaseError {
  constructor() {
    super('The updatedAt date cannot be earlier than createdAt.')
  }
}
