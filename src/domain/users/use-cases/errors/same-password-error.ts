import { UseCaseError } from '@/core/errors/use-case-error'

export class SamePasswordError extends Error implements UseCaseError {
  constructor() {
    super('The new password must be different from the current one.')
  }
}
