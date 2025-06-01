import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidSubjectError } from './errors/invalid-subject-error'

interface SubjectProps {
  value: string
}

export class Subject extends ValueObject<SubjectProps> {
  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.trim()
  }

  private static isValid(value: string): boolean {
    return value.length > 0 && value.length <= 120
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<
    InvalidSubjectError,
    Subject
  > {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidSubjectError())
    }

    const subject = new Subject({ value: normalized })

    return right(subject)
  }
}
