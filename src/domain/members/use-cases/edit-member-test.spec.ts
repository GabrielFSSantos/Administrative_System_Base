import { makeMember } from 'test/factories/members/make-member'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'
import { vi } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { EditMemberContract } from './contracts/edit-member-contract'
import { EditMemberUseCase } from './edit-member-use-case'

let membersRepository: InMemoryMembersRepository
let sut: EditMemberContract

describe('Edit Member Use Case Test', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new EditMemberUseCase(membersRepository)
  })

  it('should edit profile of a member', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const newProfileId = UniqueEntityId.create()

    const result = await sut.execute({
      memberId: member.id.toString(),
      profileId: newProfileId.toString(),
    })

    expect(result.isRight()).toBe(true)

    const updated = await membersRepository.findById(member.id.toString())

    expect(updated?.profileId.toString()).toBe(newProfileId.toString())
  })

  it('should not change profile if same as current', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const result = await sut.execute({
      memberId: member.id.toString(),
      profileId: member.profileId.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return error if member does not exist', async () => {
    const result = await sut.execute({
      memberId: 'non-existent-id',
      profileId: UniqueEntityId.create().toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.save with updated member', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const spy = vi.spyOn(membersRepository, 'save')

    await sut.execute({
      memberId: member.id.toString(),
      profileId: UniqueEntityId.create().toString(),
    })

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: member.id }))
  })
})
