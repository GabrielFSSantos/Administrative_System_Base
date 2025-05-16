import { AccessToken } from '@/domain/sessions/entities/value-objects/access-token'

export function generateFakeJwt(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ sub: 'fake-user-id', role: 'user' })).toString('base64url')
  const signature = 'fakesignature1234567890123456789012345678901234567890123'

  return `${header}.${payload}.${signature}`
}

export function generateAccessTokenValueObject(token?: string): AccessToken {
  const result = AccessToken.create(token ?? generateFakeJwt())

  if (result.isLeft()) {
    throw result.value
  }

  return result.value
}
