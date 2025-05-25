import { makeSystemAdmin } from 'test/factories/users/make-system-admin'
import { InMemorySystemAdminsRepository } from 'test/repositories/in-memory-system-admins-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { EditSystemAdminContract } from './contracts/edit-system-admin-contract'
import { EditSystemAdminUseCase } from './edit-system-admin-use-case'

let systemAdminsRepository: InMemorySystemAdminsRepository
let sut: EditSystemAdminContract

describe('Edit System Admin Use Case Test', () => {
  beforeEach(() => {
    systemAdminsRepository = new InMemorySystemAdminsRepository()
    sut = new EditSystemAdminUseCase(systemAdminsRepository)
  })

  it('should edit the profileId of a system admin', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)

    const newProfileId = 'new-profile-id'

    const result = await sut.execute({
      systemAdminId: systemAdmin.id.toString(),
      profileId: newProfileId,
    })

    expect(result.isRight()).toBe(true)

    const updated = await systemAdminsRepository.findById(systemAdmin.id.toString())

    expect(updated?.profileId.toString()).toBe(newProfileId)
  })

  it('should not change profileId if same as current', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)

    const result = await sut.execute({
      systemAdminId: systemAdmin.id.toString(),
      profileId: systemAdmin.profileId.toString(),
    })

    expect(result.isRight()).toBe(true)

    const updated = await systemAdminsRepository.findById(systemAdmin.id.toString())

    expect(updated?.profileId.toString()).toBe(systemAdmin.profileId.toString())
  })

  it('should return error if system admin does not exist', async () => {
    const result = await sut.execute({
      systemAdminId: 'non-existent-id',
      profileId: 'any-profile-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.save with updated system admin', async () => {
    const systemAdmin = await makeSystemAdmin()

    await systemAdminsRepository.create(systemAdmin)

    const spy = vi.spyOn(systemAdminsRepository, 'save')

    await sut.execute({
      systemAdminId: systemAdmin.id.toString(),
      profileId: 'tracked-profile-id',
    })

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: systemAdmin.id }))
  })
})
