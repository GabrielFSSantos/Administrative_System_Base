import { ValueObject } from '@/core/entities/value-object'

interface ActivationStatusProps {
  value: Date | null
}

export class ActivationStatus extends ValueObject<ActivationStatusProps> {
  get value(): Date | null {
    return this.props.value
  }

  public toString(): string {
    return JSON.stringify(this.value)
  }

  public isActive(): boolean {
    return this.props.value !== null
  }

  static activated(): ActivationStatus {
    return new ActivationStatus({ value: new Date() })
  }

  static deactivated(): ActivationStatus {
    return new ActivationStatus({ value: null })
  }

  public activate(): ActivationStatus {
    if (this.isActive()) return this

    return ActivationStatus.activated()
  }

  public deactivate(): ActivationStatus {
    if (!this.isActive()) return this

    return ActivationStatus.deactivated()
  }

  static create(date: Date | null): ActivationStatus {
    return new ActivationStatus({ value: date })
  }
}
