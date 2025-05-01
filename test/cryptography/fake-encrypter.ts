import { Encrypter, EncrypterResponse } from '@/core/contracts/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<EncrypterResponse> {
    return {
      accessToken: JSON.stringify(payload),
      expiresAt: new Date(Date.now() + 86_400_000),
    }
  }
}
