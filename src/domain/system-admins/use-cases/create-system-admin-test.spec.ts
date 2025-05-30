import { makeSystemAdmin } from 'test/factories/system-admins/make-system-admin'
import { InMemorySystemAdminsRepository } from 'test/repositories/in-memory-system-admins-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateSystemAdminContract } from '@/domain/system-admins/use-cases/contracts/create-system-admin-contract'
import { CreateSystemAdminUseCase } from '@/domain/system-admins/use-cases/create-system-admin-use-case'
import { SystemAdminAlreadyExistsError } from '@/domain/system-admins/use-cases/errors/system-admin-already-exists-error'

let systemAdminsRepository: InMemorySystemAdminsRepository
let sut: CreateSystemAdminContract

describe('Create SystemAdmin Use Case', () => {
  beforeEach(() => {
    systemAdminsRepository = new InMemorySystemAdminsRepository()
    sut = new CreateSystemAdminUseCase(systemAdminsRepository)
  })

  it('should create a new system admin successfully', async () => {
    const recipientId = UniqueEntityId.create()
    const profileId = UniqueEntityId.create()

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      profileId: profileId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.systemAdmin).toBeDefined()
      expect(result.value.systemAdmin.recipientId.toString()).toBe(recipientId.toString())
      expect(result.value.systemAdmin.profileId.toString()).toBe(profileId.toString())
      expect(result.value.systemAdmin.isActivated()).toBe(false)
    }
  })

  it('should not allow duplicate system admin for same recipient', async () => {
    const existing = await makeSystemAdmin()

    await systemAdminsRepository.create(existing)

    const result = await sut.execute({
      recipientId: existing.recipientId.toString(),
      profileId: existing.profileId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SystemAdminAlreadyExistsError)
  })

  it('should persist system admin in repository', async () => {
    const recipientId = UniqueEntityId.create()
    const profileId = UniqueEntityId.create()

    await sut.execute({
      recipientId: recipientId.toString(),
      profileId: profileId.toString(),
    })

    const stored = await systemAdminsRepository.findByRecipientId(
      recipientId.toString(),
    )

    expect(stored).not.toBeNull()
    expect(stored?.recipientId.toString()).toBe(recipientId.toString())
  })
})
