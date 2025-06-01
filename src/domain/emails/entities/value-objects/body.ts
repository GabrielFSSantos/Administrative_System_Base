import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidBodyError } from './errors/invalid-body-error'

interface BodyProps {
  value: string
}

export class Body extends ValueObject<BodyProps> {
  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.trim()
  }

  private static isValid(value: string): boolean {
    const length = value.length

    return length >= 10 && length <= 5000
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<InvalidBodyError, Body> {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidBodyError())
    }

    const body = new Body({ value: normalized })

    return right(body)
  }
}
