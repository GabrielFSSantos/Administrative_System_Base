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

  private static verify(value: string): boolean {
    return (ALL_PERMISSIONS as readonly string[]).includes(value)
  }

  public static parse(value: string): PermissionName {
    const normalized = this.normalize(value)

    if (!this.verify(normalized)) {
      throw new Error()
    }

    const permissionName = new PermissionName({ value: normalized })

    return permissionName
  }
}
