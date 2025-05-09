import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Role } from '@/domain/roles/entities/role'
import { PermissionName } from '@/domain/roles/entities/value-objects/permission-name'
import { EditRoleUseCase } from '@/domain/roles/use-cases/edit-role-use-case'
import { InvalidPermissionError } from '@/domain/roles/use-cases/errors/invalid-permission-error'
import { Permissions } from '@/shared/permissions'

import { EditRoleContract } from './contracts/edit-role-contract'

describe('Edit Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: EditRoleContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new EditRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to edit a role name and permissions', async () => {
    const role = Role.create({
      name: 'Old Name',
      permissions: [
        PermissionName.parse(Permissions.USERS.CREATE),
      ],
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({
      roleId: role.id.toString(),
      name: 'New Name',
      permissionValues: [
        Permissions.USERS.EDIT,
        Permissions.USERS.DELETE,
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRolesRepository.items[0].name).toBe('New Name')
    expect(inMemoryRolesRepository.items[0].permissionValues).toEqual(
      expect.arrayContaining([
        'edit_user',
        'delete_user',
      ]),
    )
  })

  it('should return error if role does not exist', async () => {
    const result = await sut.execute({
      roleId: new UniqueEntityId().toString(),
      name: 'Does Not Exist',
      permissionValues: [Permissions.USERS.VIEW],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error if permissions are invalid', async () => {
    const role = Role.create({
      name: 'Editor',
      permissions: [PermissionName.parse(Permissions.USERS.VIEW)],
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({
      roleId: role.id.toString(),
      name: 'Editor Updated',
      permissionValues: ['invalid_permission'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPermissionError)
  })

  it('should update only name if permissions remain the same', async () => {
    const role = Role.create({
      name: 'Manager',
      permissions: [
        PermissionName.parse(Permissions.SESSIONS.CREATE),
        PermissionName.parse(Permissions.SESSIONS.REVOKE),
      ],
    })
  
    await inMemoryRolesRepository.create(role)
  
    const result = await sut.execute({
      roleId: role.id.toString(),
      name: 'Updated Manager',
      permissionValues: [
        Permissions.SESSIONS.CREATE,
        Permissions.SESSIONS.REVOKE,
      ],
    })
  
    expect(result.isRight()).toBe(true)
  
    if (result.isRight()) {
      expect(result.value.role.name).toBe('Updated Manager')
      expect(result.value.role.permissionValues).toEqual(
        expect.arrayContaining(['create_session', 'revoke_session']),
      )
    }
  })
  
  it('should update only permissions if name is not provided', async () => {
    const role = Role.create({
      name: 'Unchanged Name',
      permissions: [
        PermissionName.parse(Permissions.USERS.CREATE),
      ],
    })
  
    await inMemoryRolesRepository.create(role)
  
    const result = await sut.execute({
      roleId: role.id.toString(),
      permissionValues: [
        Permissions.USERS.VIEW,
        Permissions.USERS.EDIT,
      ],
    })
  
    expect(result.isRight()).toBe(true)
  
    if (result.isRight()) {
      expect(result.value.role.name).toBe('Unchanged Name')
      expect(result.value.role.permissionValues).toEqual(
        expect.arrayContaining(['view_user', 'edit_user']),
      )
    }
  })

  it('should not update anything if no name or permissions are provided', async () => {
    const role = Role.create({
      name: 'No Change',
      permissions: [
        PermissionName.parse(Permissions.USERS.DELETE),
      ],
    })
  
    await inMemoryRolesRepository.create(role)
  
    const result = await sut.execute({
      roleId: role.id.toString(),
    })
  
    expect(result.isRight()).toBe(true)
  
    if (result.isRight()) {
      expect(result.value.role.name).toBe('No Change')
      expect(result.value.role.permissionValues).toEqual(['delete_user'])
    }
  })
  
})
