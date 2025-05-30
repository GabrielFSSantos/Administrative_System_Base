import { PermissionName } from '@/shared/value-objects/permission-name'

import { InvalidPermissionError } from './errors/invalid-permission-error'
import { validateAndParsePermissions } from './validate-and-parse-permissions-helper'

describe('Validate And Parse Permissions Tests', () => {
  it('should return all valid permissions', () => {
    const raw = ['CREATE_USER', 'VIEW_USER']
    const result = validateAndParsePermissions(raw)

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value).toHaveLength(2)
      expect(result.value[0]).toBeInstanceOf(PermissionName)
    }
  })

  it('should return InvalidPermissionError if one permission is invalid', () => {
    const raw = ['CREATE_USER', 'INVALID_PERMISSION']
    const result = validateAndParsePermissions(raw)

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPermissionError)
      expect(result.value.message).toBe(
        'Invalid permissions: Provided permission "INVALID_PERMISSION" is invalid.',
      )
    }
  })

  it('should return InvalidPermissionError with all invalid values in message', () => {
    const raw = ['FOO', 'BAR']
    const result = validateAndParsePermissions(raw)

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPermissionError)
      expect(result.value.message).toBe(
        'Invalid permissions: Provided permission "FOO" is invalid., Provided permission "BAR" is invalid.',
      )
    }
  })

  it('should return empty list if input is empty', () => {
    const raw: string[] = []
    const result = validateAndParsePermissions(raw)

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value).toEqual([])
    }
  })
})
