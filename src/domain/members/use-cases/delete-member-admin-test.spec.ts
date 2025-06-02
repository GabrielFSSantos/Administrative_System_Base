import { makeMember } from 'test/factories/members/make-member'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'
import { vi } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { DeleteMemberContract } from './contracts/delete-member-contract'
import { DeleteMemberUseCase } from './delete-member-use-case'

let membersRepository: InMemoryMembersRepository
let sut: DeleteMemberContract

describe('DeleteMemberUseCaseTest', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new DeleteMemberUseCase(membersRepository)
  })

  it('should delete a member by ID', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const result = await sut.execute({ memberId: member.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(membersRepository.items).toHaveLength(0)
  })

  it('should return ResourceNotFoundError if member does not exist', async () => {
    const result = await sut.execute({ memberId: UniqueEntityId.create().toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.delete with the correct member ID', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const deleteSpy = vi.spyOn(membersRepository, 'delete')

    await sut.execute({ memberId: member.id.toString() })

    expect(deleteSpy).toHaveBeenCalledWith(member.id.toString())
  })
})
