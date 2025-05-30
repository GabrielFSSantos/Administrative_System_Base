import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Member } from '@/domain/members/entities/member'
import { ActivationStatus } from '@/shared/value-objects/ActivationStatus/activation-status'
import { AlreadyActivatedError } from '@/shared/value-objects/ActivationStatus/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/shared/value-objects/ActivationStatus/errors/already-deactivated-error'

describe('Member Entity Test', () => {
  const recipientId = UniqueEntityId.create()
  const companyId = UniqueEntityId.create()
  const profileId = UniqueEntityId.create()

  it('should create a member with default deactivated status', () => {
    const member = Member.create({ recipientId, companyId, profileId })

    expect(member).toBeInstanceOf(Member)
    expect(member.isActivated()).toBe(false)
  })

  it('should create a member with activated status', () => {
    const member = Member.create({
      recipientId,
      companyId,
      profileId,
      activationStatus: ActivationStatus.activated(),
    })

    expect(member).toBeInstanceOf(Member)
    expect(member.isActivated()).toBe(true)
  })

  it('should activate a deactivated member', () => {
    const member = Member.create({ recipientId, companyId, profileId })

    const result = member.activate()

    expect(result.isRight()).toBe(true)
    expect(member.isActivated()).toBe(true)
  })

  it('should not activate an already active member', () => {
    const member = Member.create({
      recipientId,
      companyId,
      profileId,
      activationStatus: ActivationStatus.activated(),
    })

    const result = member.activate()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyActivatedError)
  })

  it('should deactivate an active member', () => {
    const member = Member.create({
      recipientId,
      companyId,
      profileId,
      activationStatus: ActivationStatus.activated(),
    })

    const result = member.deactivate()

    expect(result.isRight()).toBe(true)
    expect(member.isActivated()).toBe(false)
  })

  it('should not deactivate an already deactivated member', () => {
    const member = Member.create({ recipientId, companyId, profileId })

    const result = member.deactivate()

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyDeactivatedError)
  })
})
