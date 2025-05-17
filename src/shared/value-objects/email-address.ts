import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidEmailAddressError } from './errors/invalid-email-address-error'

interface EmailAddressProps {
  value: string
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase()
  }

  private static isValid(value: string): boolean {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    return (
      typeof value === 'string' &&
      value.length >= 5 &&
      value.length <= 254 &&
      emailRegex.test(value)
    )
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<
      InvalidEmailAddressError,
      EmailAddress
    > {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidEmailAddressError())
    }

    const emailAddress = new EmailAddress({ value: normalized })

    return right(emailAddress)
  }
}
