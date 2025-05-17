import { makeMember } from 'test/factories/companies/make-member'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateMemberContract } from '@/domain/companies/use-cases/contracts/create-member-contract'
import { CreateMemberUseCase } from '@/domain/companies/use-cases/create-member-use-case'
import { MemberAlreadyExistsError } from '@/domain/companies/use-cases/errors/member-already-exists-error'

let membersRepository: InMemoryMembersRepository
let sut: CreateMemberContract

describe('Create Member Use Case', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new CreateMemberUseCase(membersRepository)
  })

  it('should create a new member successfully', async () => {
    const recipientId = new UniqueEntityId()
    const companyId = new UniqueEntityId()
    const profileId = new UniqueEntityId()

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      companyId: companyId.toString(),
      profileId: profileId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.member).toBeDefined()
      expect(result.value.member.recipientId.toString()).toBe(recipientId.toString())
      expect(result.value.member.companyId.toString()).toBe(companyId.toString())
      expect(result.value.member.profileId.toString()).toBe(profileId.toString())
      expect(result.value.member.isActivated()).toBe(false)
    }
  })

  it('should not allow duplicate member for same recipient and company', async () => {
    const existing = await makeMember()

    await membersRepository.create(existing)

    const result = await sut.execute({
      recipientId: existing.recipientId.toString(),
      companyId: existing.companyId.toString(),
      profileId: existing.profileId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(MemberAlreadyExistsError)
  })

  it('should persist member in repository', async () => {
    const recipientId = new UniqueEntityId()
    const companyId = new UniqueEntityId()
    const profileId = new UniqueEntityId()

    await sut.execute({
      recipientId: recipientId.toString(),
      companyId: companyId.toString(),
      profileId: profileId.toString(),
    })

    const stored = await membersRepository.findByRecipientAndCompanyId({
      recipientId: recipientId.toString(),
      companyId: companyId.toString(),
    })

    expect(stored).not.toBeNull()
    expect(stored?.recipientId.toString()).toBe(recipientId.toString())
    expect(stored?.companyId.toString()).toBe(companyId.toString())
  })
})
