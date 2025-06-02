import { makeMember } from 'test/factories/members/make-member'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetMemberByRecipientIdAndOwnerIdContract } from './contracts/get-member-by-recipient-id-and-owner-id-contract'
import { GetMemberByRecipientIdAndOwnerIdUseCase } from './get-member-by-recipient-id-and-owner-id-use-case'

let membersRepository: InMemoryMembersRepository
let sut: GetMemberByRecipientIdAndOwnerIdContract

describe('GetMemberByRecipientIdAndOwnerIdUseCaseTest', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new GetMemberByRecipientIdAndOwnerIdUseCase(membersRepository)
  })

  it('should retrieve a member by recipientId and ownerId', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const result = await sut.execute({
      recipientId: member.recipientId.toString(),
      ownerId: member.ownerId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.member.id.toString()).toBe(member.id.toString())
    }
  })

  it('should return error if member does not exist', async () => {
    const result = await sut.execute({
      recipientId: 'non-existent-id',
      ownerId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository with correct params', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const spy = vi.spyOn(membersRepository, 'findByRecipientAndOwnerId')

    await sut.execute({
      recipientId: member.recipientId.toString(),
      ownerId: member.ownerId.toString(),
    })

    expect(spy).toHaveBeenCalledWith({
      recipientId: member.recipientId.toString(),
      ownerId: member.ownerId.toString(),
    })
  })
})
