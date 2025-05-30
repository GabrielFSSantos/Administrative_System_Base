import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { SystemAdmin } from '@/domain/system-admins/entities/system-admin'
import { ActivationStatus } from '@/shared/ActivationStatus/value-objects/activation-status'
import { AlreadyActivatedError } from '@/shared/ActivationStatus/value-objects/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/shared/ActivationStatus/value-objects/errors/already-deactivated-error'

describe('SystemAdmin Entity Test', () => {
  const recipientId = UniqueEntityId.create()
  const profileId = UniqueEntityId.create()

  it('should create a system admin with default deactivated status', () => {
    const systemAdmin = SystemAdmin.create({ recipientId, profileId })

    expect(systemAdmin).toBeInstanceOf(SystemAdmin)
    expect(systemAdmin.isActivated()).toBe(false)
  })

  it('should create a system admin with activated status', () => {
    const systemAdmin = SystemAdmin.create({
      recipientId,
      profileId,
      activationStatus: ActivationStatus.activated(),
    })

    expect(systemAdmin).toBeInstanceOf(SystemAdmin)
    expect(systemAdmin.isActivated()).toBe(true)
  })

  it('should activate a deactivated system admin', () => {
    const systemAdmin = SystemAdmin.create({ recipientId, profileId })

    const result = systemAdmin.activate()

    expect(result.isRight()).toBe(true)
    expect(systemAdmin.isActivated()).toBe(true)
  })

  it('should not activate an already active system admin', () => {
    const systemAdmin = SystemAdmin.create({
      recipientId,
      profileId,
      activationStatus: ActivationStatus.activated(),
    })

    const result = systemAdmin.activate()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyActivatedError)
  })

  it('should deactivate an active system admin', () => {
    const systemAdmin = SystemAdmin.create({
      recipientId,
      profileId,
      activationStatus: ActivationStatus.activated(),
    })

    const result = systemAdmin.deactivate()

    expect(result.isRight()).toBe(true)
    expect(systemAdmin.isActivated()).toBe(false)
  })

  it('should not deactivate an already deactivated system admin', () => {
    const systemAdmin = SystemAdmin.create({ recipientId, profileId })

    const result = systemAdmin.deactivate()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyDeactivatedError)
  })
})
