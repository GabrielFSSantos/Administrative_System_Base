import { DomainError } from '@/core/errors/domain-error'

export class InvalidLocaleError extends Error implements DomainError {
  constructor(locale: string) {
    super(`Invalid locale: "${locale}"`)
  }
}
