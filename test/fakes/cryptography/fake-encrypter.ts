import { EncrypterContract, EncrypterResponse } from '@/core/contracts/cryptography/encrypter-contract'

export class FakeEncrypter implements EncrypterContract {
  async encrypt(payload: Record<string, unknown>): Promise<EncrypterResponse> {
    return {
      accessToken: JSON.stringify(payload),
      expiresAt: new Date(Date.now() + 86_400_000),
    }
  }
}
