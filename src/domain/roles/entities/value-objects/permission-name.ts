import { ValueObject } from '@/core/entities/value-object'
import { ALL_PERMISSIONS } from '@/shared/permissions'

interface PermissionNameProps {
  value: string
}

export class PermissionName extends ValueObject<PermissionNameProps> {

  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '_')
  }

  static parse(value: string): PermissionName {
    return new PermissionName({ value: this.normalize(value) })
  }

  static verify(value: string): boolean {
    return (ALL_PERMISSIONS as readonly string[]).includes(this.normalize(value))
  }
}
