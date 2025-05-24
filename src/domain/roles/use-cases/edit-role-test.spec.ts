import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { generatePermissionList } from 'test/factories/value-objects/make-permissions'
import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { EditRoleUseCase } from '@/domain/roles/use-cases/edit-role-use-case'
import { InvalidPermissionError } from '@/domain/roles/use-cases/errors/invalid-permission-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { Permissions } from '@/shared/permissions'
import { InvalidNameError } from '@/shared/value-objects/errors/invalid-name-error'

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
      recipientId: new UniqueEntityId('company-1'),
      name: generateNameValueObject('Old Name'),
      permissions: generatePermissionList(1),
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
    expect(inMemoryRolesRepository.items[0].name.value).toBe('New Name')
    expect(inMemoryRolesRepository.items[0].permissionValues).toEqual(
      expect.arrayContaining(['edit_user', 'delete_user']),
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
      recipientId: new UniqueEntityId('company-1'),
      name: generateNameValueObject('Editor'),
      permissions: generatePermissionList(1),
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
      recipientId: new UniqueEntityId('company-1'),
      name: generateNameValueObject('Manager'),
      permissions: generatePermissionList(2),
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
      expect(result.value.role.name.value).toBe('Updated Manager')
      expect(result.value.role.permissionValues).toEqual(
        expect.arrayContaining(['create_session', 'revoke_session']),
      )
    }
  })

  it('should update only permissions if name is not provided', async () => {
    const role = Role.create({
      recipientId: new UniqueEntityId('company-1'),
      name: generateNameValueObject('Unchanged Name'),
      permissions: generatePermissionList(1),
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
      expect(result.value.role.name.value).toBe('Unchanged Name')
      expect(result.value.role.permissionValues).toEqual(
        expect.arrayContaining(['view_user', 'edit_user']),
      )
    }
  })

  it('should not update anything if no name or permissions are provided', async () => {
    const role = Role.create({
      recipientId: new UniqueEntityId('company-1'),
      name: generateNameValueObject('No Change'),
      permissions: generatePermissionList(1),
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({
      roleId: role.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.role.name.value).toBe('No Change')
      expect(result.value.role.permissionValues.length).toBe(1)
    }
  })

  it('should throw if name is invalid', async () => {
    const role = Role.create({
      recipientId: new UniqueEntityId('company-1'),
      name: generateNameValueObject('Valid Name'),
      permissions: generatePermissionList(1),
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({
      roleId: role.id.toString(),
      name: '   ',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidNameError)
  })
})
