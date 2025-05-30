import { Permissions } from '@/shared/permissions'

import { InvalidPermissionNameError } from './errors/invalid-permission-name-error'
import { PermissionName } from './permission-name'

describe('PermissionName Value Object Test', () => {
  it('should create a valid permission name object', () => {
    const result = PermissionName.parse('create_user')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionName)
    expect(result.value.toString()).toBe('create_user')
  })

  it('should normalize values with spaces and uppercase', () => {
    const result = PermissionName.parse('   Create   User  ')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('create_user')
  })

  it('should return error for completely invalid permission name', () => {
    const result = PermissionName.parse('invalid_permission')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPermissionNameError)
  })

  it('should return error for empty string', () => {
    const result = PermissionName.parse('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPermissionNameError)
  })

  it('should normalize permission to match ALL_PERMISSIONS even with mixed case and extra spaces', () => {
    const result = PermissionName.parse('   CrEate_sessION ')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('create_session')
  })

  it('should return all valid permissions successfully', () => {
    const all: string[] = Object.values(Permissions).flatMap((group) =>
      Object.values(group),
    )

    for (const permission of all) {
      const result = PermissionName.parse(permission)

      expect(result.isRight()).toBe(true)
      expect(result.value).toBeInstanceOf(PermissionName)
    }
  })

  it('should compare equality of two normalized permission names', () => {
    const a = PermissionName.parse('Create_User')
    const b = PermissionName.parse('  create_user  ')

    expect(a.isRight()).toBe(true)
    expect(b.isRight()).toBe(true)

    if (a.isRight() && b.isRight()) {
      expect(a.value.equals(b.value)).toBe(true)
    }
  })
})
