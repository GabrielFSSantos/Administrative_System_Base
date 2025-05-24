import { makeMember } from 'test/factories/companies/make-member'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetMemberByRecipientIdAndCompanyIdContract } from './contracts/get-member-by-recipient-id-and-company-id-contract'
import { GetMemberByRecipientIdAndCompanyIdUseCase } from './get-member-by-recipient-id-and-company-id-use-case'

let membersRepository: InMemoryMembersRepository
let sut: GetMemberByRecipientIdAndCompanyIdContract

describe('Get Member By RecipientId and CompanyId Use Case Test', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new GetMemberByRecipientIdAndCompanyIdUseCase(membersRepository)
  })

  it('should retrieve a member by recipientId and companyId', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const result = await sut.execute({
      recipientId: member.recipientId.toString(),
      companyId: member.companyId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.member.id.toString()).toBe(member.id.toString())
    }
  })

  it('should return error if member does not exist', async () => {
    const result = await sut.execute({
      recipientId: 'non-existent-id',
      companyId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository with correct params', async () => {
    const member = await makeMember()

    await membersRepository.create(member)

    const spy = vi.spyOn(membersRepository, 'findByRecipientAndCompanyId')

    await sut.execute({
      recipientId: member.recipientId.toString(),
      companyId: member.companyId.toString(),
    })

    expect(spy).toHaveBeenCalledWith({
      recipientId: member.recipientId.toString(),
      companyId: member.companyId.toString(),
    })
  })
})
