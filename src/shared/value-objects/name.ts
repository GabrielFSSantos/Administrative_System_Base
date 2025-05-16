import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidNameError } from './errors/invalid-name-error'

interface NameProps {
  value: string
}

export class Name extends ValueObject<NameProps> {

  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
      .join(' ')
  }

  private static isValid(value: string): boolean {

    if (value.length < 3 || value.length > 50) return false

    // Permite letras, espaços e acentos. Rejeita números e símbolos especiais.
    const validPattern = /^[A-Za-zÀ-ÿ\s]+$/

    if (!validPattern.test(value)) return false

    return true
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<
    InvalidNameError,
    Name
  > {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidNameError())
    }

    const name = new Name({ value: normalized })

    return right(name)
  }
}
