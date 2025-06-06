// invalid-failure-log-data-error.ts
import { DomainError } from '@/core/errors/domain-error'

export class InvalidFailureLogDataError extends Error implements DomainError {
  constructor() {
    super('FailureLog input data is invalid.')
  }
}
