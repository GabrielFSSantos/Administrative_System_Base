export interface EncrypterResponse {
  accessToken: string,
  expiresAt: Date,
}

export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<EncrypterResponse>
}
