import { AccessToken } from '../value-objects/access-token'
import { InvalidAccessTokenError } from '../value-objects/errors/invalid-access-token-error'

describe('AccessToken Value Object Test', () => {
  const validJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJzdWIiOiJ1c2VySWQxMjMiLCJyb2xlIjoiYWRtaW4ifQ.' +
    'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'

  it('should create a valid AccessToken object', () => {
    const result = AccessToken.create(validJwt)

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(AccessToken)
    expect(result.value.toString()).toBe(validJwt)
  })

  it('should trim token input before validation', () => {
    const result = AccessToken.create(`  ${validJwt}   `)

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe(validJwt)
  })

  it('should return error for token without 3 parts', () => {
    const result = AccessToken.create('invalid-token')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccessTokenError)
  })

  it('should return error for empty string', () => {
    const result = AccessToken.create('')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccessTokenError)
  })

  it('should extract claims from token payload', () => {
    const result = AccessToken.create(validJwt)

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const payload = result.value.getPayload()

      expect(payload).toBeDefined()
      expect(payload?.sub).toBe('userId123')
      expect(payload?.role).toBe('admin')
    }
  })

  it('should extract a specific claim using getClaim()', () => {
    const result = AccessToken.create(validJwt)

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.getClaim('sub')).toBe('userId123')
      expect(result.value.getClaim('role')).toBe('admin')
      expect(result.value.getClaim('missing')).toBeNull()
    }
  })

  it('should return null for payload if token is malformed', () => {
    const malformed = 'abc.def.ghi'
    const result = AccessToken.create(malformed)

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const payload = result.value.getPayload()

      expect(payload).toBeNull()
    }
  })

  it('should compare AccessToken equality correctly', () => {
    const a = AccessToken.create(validJwt)
    const b = AccessToken.create(validJwt)

    expect(a.isRight()).toBe(true)
    expect(b.isRight()).toBe(true)

    if (a.isRight() && b.isRight()) {
      expect(a.value.equals(b.value)).toBe(true)
    }
  })
})
