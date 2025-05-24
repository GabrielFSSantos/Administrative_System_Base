import { makeSystemAdmin } from 'test/factories/users/make-system-admin'
import { InMemorySystemAdminsRepository } from 'test/repositories/in-memory-system-admins-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetSystemAdminByIdContract } from './contracts/get-system-admin-by-id-contract'
import { GetSystemAdminByIdUseCase } from './get-system-admin-by-id-use-case'

let systemAdminsRepository: InMemorySystemAdminsRepository
let sut: GetSystemAdminByIdContract

describe('Get System Admin By ID Use Case Test', () => {
  beforeEach(() => {
    systemAdminsRepository = new InMemorySystemAdminsRepository()
    sut = new GetSystemAdminByIdUseCase(systemAdminsRepository)
  })

  it('should retrieve a system admin by valid id', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)

    const result = await sut.execute({ systemAdminId: systemAdmin.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.systemAdmin.id.toString()).toBe(systemAdmin.id.toString())
      expect(result.value.systemAdmin.recipientId.toString()).toBe(systemAdmin.recipientId.toString())
      expect(result.value.systemAdmin.profileId.toString()).toBe(systemAdmin.profileId.toString())
    }
  })

  it('should return error if system admin does not exist', async () => {
    const result = await sut.execute({ systemAdminId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should call repository with correct id', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)

    const spy = vi.spyOn(systemAdminsRepository, 'findById')

    await sut.execute({ systemAdminId: systemAdmin.id.toString() })

    expect(spy).toHaveBeenCalledWith(systemAdmin.id.toString())
  })

  it('should not retrieve a system admin after deletion', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)
    await systemAdminsRepository.delete(systemAdmin.id)

    const result = await sut.execute({ systemAdminId: systemAdmin.id.toString() })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
