import { EncrypterContract, IEncrypterResponse } from '@/shared/services/cryptography/contracts/encrypter-contract'

export class FakeEncrypter implements EncrypterContract {
  async encrypt(payload: Record<string, unknown>): Promise<IEncrypterResponse> {
    return {
      accessToken: JSON.stringify(payload),
      expiresAt: new Date(Date.now() + 86_400_000),
    }
  }
}
