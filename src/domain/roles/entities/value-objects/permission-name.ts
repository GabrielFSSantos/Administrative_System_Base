import { ValueObject } from '@/core/entities/value-object'

interface PermissionNameProps {
  value: string
}

export class PermissionName extends ValueObject<PermissionNameProps> {
  get value(): string {
    return this.props.value
  }

  static create(name: string): PermissionName {
    const normalized = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_') 

    return new PermissionName({ value: normalized })
  }
}
