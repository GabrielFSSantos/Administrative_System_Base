import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Role } from '@/domain/roles/entities/role'
import { PermissionName } from '@/domain/roles/entities/value-objects/permission-name'
import { GetRoleUseCase } from '@/domain/roles/use-cases/get-role-use-case'

import { GetRoleContract } from './contracts/get-role-contract'

describe('Get Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: GetRoleContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new GetRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to get an existing role by ID', async () => {
    const role = Role.create({
      name: 'Viewer',
      permissions: [
        PermissionName.parse('view_user'),
        PermissionName.parse('edit_user'),
      ],
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({ roleId: role.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.role.name).toBe('Viewer')
      expect(result.value.role.permissionValues).toEqual(
        expect.arrayContaining(['view_user', 'edit_user']),
      )
    }
  })

  it('should return error if role does not exist', async () => {
    const invalidId = new UniqueEntityId().toString()

    const result = await sut.execute({ roleId: invalidId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
