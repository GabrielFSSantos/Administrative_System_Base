import { makeMember } from 'test/factories/companies/make-member'
import { generateActivationStatusValueObject } from 'test/factories/companies/value-objects/make-activation-status'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'
import { vi } from 'vitest'

import { AlreadyActivatedError } from '@/domain/companies/entities/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/domain/companies/entities/errors/already-deactivated-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SetMemberActivationStatusContract } from './contracts/set-member-activation-status-contract'
import { SetMemberActivationStatusUseCase } from './set-member-activation-status-use-case'

let membersRepository: InMemoryMembersRepository
let sut: SetMemberActivationStatusContract

describe('Set Member Activation Status Use Case', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new SetMemberActivationStatusUseCase(membersRepository)
  })

  it('should activate a deactivated member', async () => {
    const member = await makeMember() // default is deactivated

    await membersRepository.create(member)

    const result = await sut.execute({
      memberId: member.id.toString(),
      activationStatus: true,
    })

    expect(result.isRight()).toBe(true)

    const updated = await membersRepository.findById(member.id.toString())

    expect(updated?.isActivated()).toBe(true)
  })

  it('should deactivate an active member', async () => {
    const member = await makeMember({ 
      activationStatus: generateActivationStatusValueObject(true), 
    })

    await membersRepository.create(member)

    const result = await sut.execute({
      memberId: member.id.toString(),
      activationStatus: false,
    })

    expect(result.isRight()).toBe(true)

    const updated = await membersRepository.findById(member.id.toString())

    expect(updated?.isActivated()).toBe(false)
  })

  it('should return ResourceNotFoundError if member does not exist', async () => {
    const result = await sut.execute({
      memberId: 'non-existent-id',
      activationStatus: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return AlreadyActivatedError if member is already active', async () => {
    const member = await makeMember({ 
      activationStatus: generateActivationStatusValueObject(true), 
    })

    await membersRepository.create(member)

    const result = await sut.execute({
      memberId: member.id.toString(),
      activationStatus: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyActivatedError)
  })

  it('should return AlreadyDeactivatedError if member is already inactive', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const result = await sut.execute({
      memberId: member.id.toString(),
      activationStatus: false,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyDeactivatedError)
  })

  it('should call repository.save when activation is changed', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const spy = vi.spyOn(membersRepository, 'save')

    await sut.execute({
      memberId: member.id.toString(),
      activationStatus: true,
    })

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: member.id }))
  })
})
