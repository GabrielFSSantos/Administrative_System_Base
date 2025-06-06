import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidErrorMessageError } from './errors/invalid-error-message-error'

export class FailureErrorMessage extends ValueObject<{ value: string }> {
  get value(): string {
    return this.props.value
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<Error, FailureErrorMessage> {
    if (!value || value.trim().length === 0) {
      return left(new InvalidErrorMessageError())
    }

    return right(new FailureErrorMessage({ value: value.trim() }))
  }
}