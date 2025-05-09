import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Role } from '@/domain/roles/entities/role'
import { PermissionName } from '@/domain/roles/entities/value-objects/permission-name'
import { DeleteRoleUseCase } from '@/domain/roles/use-cases/delete-role-use-case'

describe('Delete Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: DeleteRoleUseCase

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new DeleteRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to delete an existing role', async () => {
    const role = Role.create({
      name: 'Admin',
      permissions: [
        PermissionName.parse('create_user'),
        PermissionName.parse('edit_user'),
      ],
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({ roleId: role.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRolesRepository.items).toHaveLength(0)
  })

  it('should return error if role does not exist', async () => {
    const nonExistentId = new UniqueEntityId().toString()

    const result = await sut.execute({ roleId: nonExistentId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
