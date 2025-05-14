import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateRoleContract } from '@/domain/roles/use-cases/contracts/create-role-contract'
import { CreateRoleUseCase } from '@/domain/roles/use-cases/create-role-use-case'
import { InvalidPermissionError } from '@/domain/roles/use-cases/errors/invalid-permission-error'
import { Permissions } from '@/shared/permissions'

import { InvalidRoleNameError } from '../entities/errors/invalid-role-name-error'

describe('Create Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: CreateRoleContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new CreateRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to create a role', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId('company-1').toString(),
      name: 'Manager',
      permissionValues: [Permissions.USERS.CREATE, Permissions.SESSIONS.CREATE],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRolesRepository.items.length).toBe(1)
    expect(inMemoryRolesRepository.items[0].name).toBe('Manager')
    expect(inMemoryRolesRepository.items[0]).toEqual(expect.objectContaining({
      name: 'Manager',
      recipientId: new UniqueEntityId('company-1'),
    }))
  })

  it('should not create role with invalid permissions', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId('company-1').toString(),
      name: 'Invalid Role',
      permissionValues: ['invalid_permission'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPermissionError)
  })

  it('should normalize and store permissions correctly', async () => {
    await sut.execute({
      recipientId: new UniqueEntityId('company-1').toString(),
      name: 'Editor',
      permissionValues: [Permissions.USERS.EDIT, Permissions.USERS.VIEW],
    })

    const role = inMemoryRolesRepository.items[0]

    expect(role.permissionValues).toContain('edit_user')
    expect(role.permissionValues).toContain('view_user')
  })

  it('should persist the exact permission values passed', async () => {
    const permissionValues = [Permissions.SESSIONS.CREATE, Permissions.SESSIONS.REVOKE]

    await sut.execute({
      recipientId: new UniqueEntityId('company-1').toString(),
      name: 'Session Admin',
      permissionValues,
    })

    const stored = inMemoryRolesRepository.items[0]

    expect(stored.permissionValues).toEqual(expect.arrayContaining(permissionValues))
  })

  it('should throw if name is invalid', async () => {
    let error: unknown

    try {
      await sut.execute({
        recipientId: new UniqueEntityId('company-1').toString(),
        name: '   ', // nome inválido
        permissionValues: [Permissions.USERS.CREATE],
      })
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(InvalidRoleNameError)
  })
})
