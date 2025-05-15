import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidAccessTokenError } from './errors/invalid-access-token-error'

export class AccessToken extends ValueObject<{ value: string }> {
  get value(): string {
    return this.props.value
  }

  public getPayload(): Record<string, any> | null {
    try {
      const payloadBase64 = this.props.value.split('.')[1]
      const json = Buffer.from(payloadBase64, 'base64').toString('utf8')

      return JSON.parse(json)
    } catch {
      return null
    }
  }

  public getClaim<T = any>(key: string): T | null {
    const payload = this.getPayload()

    return payload?.[key] ?? null
  }

  public toString(): string {
    return this.value
  }

  static isValid(token: string): boolean {
    // Regra mínima: token JWT com 3 partes separadas por pontos
    return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)
  }

  static create(value: string): Either<
      InvalidAccessTokenError,
      AccessToken
    > {
    const normalized = value.trim()

    if (!this.isValid(normalized)) {
      return left(new InvalidAccessTokenError)
    }

    const accessToken = new AccessToken({ value: normalized })
    
    return right(accessToken)
  }
}
