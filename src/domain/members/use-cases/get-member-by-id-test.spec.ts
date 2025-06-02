import { makeMember } from 'test/factories/members/make-member'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetMemberByIdContract } from './contracts/get-member-by-id-contract'
import { GetMemberByIdUseCase } from './get-member-by-id-use-case'

let membersRepository: InMemoryMembersRepository
let sut: GetMemberByIdContract

describe('GetMemberByIdUseCaseTest', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new GetMemberByIdUseCase(membersRepository)
  })

  it('should retrieve a member by valid id', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const result = await sut.execute({ memberId: member.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.member.id.toString()).toBe(member.id.toString())
    }
  })

  it('should return error if member does not exist', async () => {
    const result = await sut.execute({ memberId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository with correct id', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const spy = vi.spyOn(membersRepository, 'findById')

    await sut.execute({ memberId: member.id.toString() })

    expect(spy).toHaveBeenCalledWith(member.id.toString())
  })
})
