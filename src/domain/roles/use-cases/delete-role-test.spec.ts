import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { generatePermissionList } from 'test/factories/value-objects/make-permissions'
import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { DeleteRoleUseCase } from '@/domain/roles/use-cases/delete-role-use-case'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { DeleteRoleContract } from './contracts/delete-role-contract'

describe('Delete Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: DeleteRoleContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new DeleteRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to delete an existing role', async () => {
    const role = Role.create({
      recipientId: UniqueEntityId.create('company-1'),
      name: generateNameValueObject('Admin'),
      permissions: generatePermissionList(2), 
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({ roleId: role.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRolesRepository.items).toHaveLength(0)
  })

  it('should return error if role does not exist', async () => {
    const nonExistentId = UniqueEntityId.create().toString()

    const result = await sut.execute({ roleId: nonExistentId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
