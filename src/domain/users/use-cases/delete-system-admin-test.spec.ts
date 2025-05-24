import { makeSystemAdmin } from 'test/factories/users/make-system-admin'
import { InMemorySystemAdminsRepository } from 'test/repositories/in-memory-system-admins-repository'
import { vi } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { DeleteSystemAdminContract } from './contracts/delete-system-admin-contract'
import { DeleteSystemAdminUseCase } from './delete-system-admin-use-case'

let inMemorySystemAdminsRepository: InMemorySystemAdminsRepository
let sut: DeleteSystemAdminContract

describe('Delete System Admin Use Case Test', () => {
  beforeEach(() => {
    inMemorySystemAdminsRepository = new InMemorySystemAdminsRepository()
    sut = new DeleteSystemAdminUseCase(inMemorySystemAdminsRepository)
  })

  it('should delete a system admin by ID', async () => {
    const systemAdmin = await makeSystemAdmin()

    await inMemorySystemAdminsRepository.create(systemAdmin)

    const result = await sut.execute({ systemAdminId: systemAdmin.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(inMemorySystemAdminsRepository.items).toHaveLength(0)
  })

  it('should return ResourceNotFoundError if system admin does not exist', async () => {
    const result = await sut.execute({ systemAdminId: new UniqueEntityId().toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.delete with the correct system admin ID', async () => {
    const systemAdmin = await makeSystemAdmin()

    await inMemorySystemAdminsRepository.create(systemAdmin)

    const deleteSpy = vi.spyOn(inMemorySystemAdminsRepository, 'delete')

    await sut.execute({ systemAdminId: systemAdmin.id.toString() })

    expect(deleteSpy).toHaveBeenCalledWith(systemAdmin.id)
  })

  it('should preserve other system admins after deletion', async () => {
    const systemAdmin1 = await makeSystemAdmin()
    const systemAdmin2 = await makeSystemAdmin()

    await inMemorySystemAdminsRepository.create(systemAdmin1)
    await inMemorySystemAdminsRepository.create(systemAdmin2)

    await sut.execute({ systemAdminId: systemAdmin1.id.toString() })

    expect(inMemorySystemAdminsRepository.items).toHaveLength(1)
    expect(inMemorySystemAdminsRepository.items[0].id.toString()).toBe(systemAdmin2.id.toString())
  })

  it('should not find system admin after it is deleted', async () => {
    const systemAdmin = await makeSystemAdmin()

    await inMemorySystemAdminsRepository.create(systemAdmin)

    await sut.execute({ systemAdminId: systemAdmin.id.toString() })

    const result = await inMemorySystemAdminsRepository.findById(systemAdmin.id.toString())

    expect(result).toBeNull()
  })

  it('should not throw when trying to delete system admin twice', async () => {
    const systemAdmin = await makeSystemAdmin()

    await inMemorySystemAdminsRepository.create(systemAdmin)

    await sut.execute({ systemAdminId: systemAdmin.id.toString() })
    const result = await sut.execute({ systemAdminId: systemAdmin.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
