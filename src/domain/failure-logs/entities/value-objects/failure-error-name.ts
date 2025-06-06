import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidErrorNameError } from './errors/invalid-error-name-error'

export class FailureErrorName extends ValueObject<{ value: string }> {
  get value(): string {
    return this.props.value
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<Error, FailureErrorName> {
    if (!value || value.trim().length === 0) {
      return left(new InvalidErrorNameError())
    }

    return right(new FailureErrorName({ value: value.trim() }))
  }
}
