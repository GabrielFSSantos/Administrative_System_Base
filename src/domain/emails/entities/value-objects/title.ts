import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidTitleError } from './errors/invalid-title-error'

interface TitleProps {
  value: string
}

export class Title extends ValueObject<TitleProps> {
  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.trim()
  }

  private static isValid(value: string): boolean {
    return value.length > 0 && value.length <= 200
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<InvalidTitleError, Title> {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidTitleError())
    }

    const title = new Title({ value: normalized })

    return right(title)
  }
}
