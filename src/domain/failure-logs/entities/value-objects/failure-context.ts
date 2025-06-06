import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidFailureContextError } from './errors/invalid-failure-context-error'

export class FailureContext extends ValueObject<{ value: string }> {
  get value(): string {
    return this.props.value
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<Error, FailureContext> {
    if (!value || value.trim().length === 0) {
      return left(new InvalidFailureContextError())
    }

    return right(new FailureContext({ value: value.trim() }))
  }
}