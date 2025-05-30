import { makeSystemAdmin } from 'test/factories/system-admins/make-system-admin'
import { InMemorySystemAdminsRepository } from 'test/repositories/in-memory-system-admins-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetSystemAdminByRecipientIdContract } from './contracts/get-system-admin-by-recipient-id-contract'
import { GetSystemAdminByRecipientIdUseCase } from './get-system-admin-by-recipient-id-use-case'

let systemAdminsRepository: InMemorySystemAdminsRepository
let sut: GetSystemAdminByRecipientIdContract

describe('Get System Admin By Recipient ID Use Case Test', () => {
  beforeEach(() => {
    systemAdminsRepository = new InMemorySystemAdminsRepository()
    sut = new GetSystemAdminByRecipientIdUseCase(systemAdminsRepository)
  })

  it('should retrieve a system admin by valid recipientId', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)

    const result = await sut.execute({ recipientId: systemAdmin.recipientId.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.systemAdmin.id.toString()).toBe(systemAdmin.id.toString())
      expect(result.value.systemAdmin.recipientId.toString()).toBe(systemAdmin.recipientId.toString())
      expect(result.value.systemAdmin.profileId.toString()).toBe(systemAdmin.profileId.toString())
    }
  })

  it('should return error if system admin does not exist for recipientId', async () => {
    const result = await sut.execute({ recipientId: 'non-existent-recipient-id' })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should call repository with correct recipientId', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)

    const spy = vi.spyOn(systemAdminsRepository, 'findByRecipientId')

    await sut.execute({ recipientId: systemAdmin.recipientId.toString() })

    expect(spy).toHaveBeenCalledWith(systemAdmin.recipientId.toString())
  })

  it('should not retrieve a system admin after deletion', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)
    await systemAdminsRepository.delete(systemAdmin.id.toString())

    const result = await sut.execute({ recipientId: systemAdmin.recipientId.toString() })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
