import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidActionLinkError } from './errors/invalid-action-link-error'

interface ActionLinkProps {
  value: string
}

export class ActionLink extends ValueObject<ActionLinkProps> {
  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.trim()
  }

  private static isValid(value: string): boolean {
    try {
      const url = new URL(value)

      return ['http:', 'https:'].includes(url.protocol)
    } catch {
      return false
    }
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<
    InvalidActionLinkError,
    ActionLink
  > {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidActionLinkError())
    }

    const actionLink = new ActionLink({ value: normalized })

    return right(actionLink)
  }
}
