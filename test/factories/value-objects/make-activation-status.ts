import { ActivationStatus } from '@/shared/value-objects/activation-status/activation-status'

export function generateActivationStatusValueObject(status?: boolean): ActivationStatus {
  const resolved = status ?? Math.random() > 0.5

  return resolved
    ? ActivationStatus.activated()
    : ActivationStatus.deactivated()
}
