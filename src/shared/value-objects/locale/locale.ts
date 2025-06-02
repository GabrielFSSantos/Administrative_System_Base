import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidLocaleError } from './errors/invalid-locale-error'
import { SupportedLocale } from './locale.enum'

interface LocaleProps {
  value: SupportedLocale
}

export class Locale extends ValueObject<LocaleProps> {
  get value(): SupportedLocale {
    return this.props.value
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<InvalidLocaleError, Locale> {
    const isValid = Object.values(SupportedLocale).includes(value as SupportedLocale)

    if (!isValid) {
      return left(new InvalidLocaleError(value))
    }

    return right(new Locale({ value: value as SupportedLocale }))
  }

}
