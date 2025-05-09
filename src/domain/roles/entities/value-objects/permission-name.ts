import { ValueObject } from '@/core/entities/value-object'
import { ALL_PERMISSIONS } from '@/shared/permissions'

interface PermissionNameProps {
  value: string
}

export class PermissionName extends ValueObject<PermissionNameProps> {
  private constructor(props: PermissionNameProps) {
    super(props)
  }

  get value(): string {
    return this.props.value
  }

  static parse(value: string): PermissionName {
    const normalized = value.trim().toLowerCase().replace(/\s+/g, '_')

    return new PermissionName({ value: normalized })
  }

  static verify(value: string): boolean {
    const normalized = value.trim().toLowerCase().replace(/\s+/g, '_')
  
    return (ALL_PERMISSIONS as readonly string[]).includes(normalized)
  }
}
