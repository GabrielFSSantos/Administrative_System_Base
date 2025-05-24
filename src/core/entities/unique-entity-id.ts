import { randomUUID } from 'node:crypto'

import { ValueObject } from './value-object'

interface UniqueEntityIdProps {
  value: string
}

export class UniqueEntityId extends ValueObject<UniqueEntityIdProps> {

  get value(): string {
    return this.props.value
  }

  public toString(): string {
    return this.value
  }

  public toValue(): string {
    return this.props.value
  }

  static create(value?: string): UniqueEntityId {
    return new UniqueEntityId({ value: value ?? randomUUID() })
  }
}
