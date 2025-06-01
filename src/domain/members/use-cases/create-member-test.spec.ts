import { makeMember } from 'test/factories/members/make-member'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateMemberContract } from '@/domain/members/use-cases/contracts/create-member-contract'
import { CreateMemberUseCase } from '@/domain/members/use-cases/create-member-use-case'
import { MemberAlreadyExistsError } from '@/domain/members/use-cases/errors/member-already-exists-error'

let membersRepository: InMemoryMembersRepository
let sut: CreateMemberContract

describe('Create Member Use Case', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new CreateMemberUseCase(membersRepository)
  })

  it('should create a new member successfully', async () => {
    const recipientId = UniqueEntityId.create()
    const ownerId = UniqueEntityId.create()
    const profileId = UniqueEntityId.create()

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      ownerId: ownerId.toString(),
      profileId: profileId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.member).toBeDefined()
      expect(result.value.member.recipientId.toString()).toBe(recipientId.toString())
      expect(result.value.member.ownerId.toString()).toBe(ownerId.toString())
      expect(result.value.member.profileId.toString()).toBe(profileId.toString())
      expect(result.value.member.isActivated()).toBe(false)
    }
  })

  it('should not allow duplicate member for same recipient and owner', async () => {
    const existing = await makeMember()

    await membersRepository.create(existing)

    const result = await sut.execute({
      recipientId: existing.recipientId.toString(),
      ownerId: existing.ownerId.toString(),
      profileId: existing.profileId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(MemberAlreadyExistsError)
  })

  it('should persist member in repository', async () => {
    const recipientId = UniqueEntityId.create()
    const ownerId = UniqueEntityId.create()
    const profileId = UniqueEntityId.create()

    await sut.execute({
      recipientId: recipientId.toString(),
      ownerId: ownerId.toString(),
      profileId: profileId.toString(),
    })

    const stored = await membersRepository.findByRecipientAndOwnerId({
      recipientId: recipientId.toString(),
      ownerId: ownerId.toString(),
    })

    expect(stored).not.toBeNull()
    expect(stored?.recipientId.toString()).toBe(recipientId.toString())
    expect(stored?.ownerId.toString()).toBe(ownerId.toString())
  })
})
