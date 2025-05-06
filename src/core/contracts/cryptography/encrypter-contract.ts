export interface IEncrypterResponse {
  accessToken: string,
  expiresAt: Date,
}

export abstract class EncrypterContract {
  abstract encrypt(payload: Record<string, unknown>): Promise<IEncrypterResponse>
}
