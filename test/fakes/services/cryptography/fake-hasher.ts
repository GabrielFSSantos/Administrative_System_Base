import { HashComparerContract } from '@/shared/services/cryptography/contracts/hash-comparer-contract'
import { HashGeneratorContract } from '@/shared/services/cryptography/contracts/hash-generator-contract'

export class FakeHasher implements HashGeneratorContract, HashComparerContract {
  private readonly prefix = '$2a$10$'
  private readonly charset = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  private generateFakeBodyFromPlain(plain: string): string {
    let hash = ''

    for (let i = 0; i < 53; i++) {
      const char = plain.charCodeAt(i % plain.length)

      hash += this.charset.charAt(char % this.charset.length)
    }

    return hash
  }

  async generate(plain: string): Promise<string> {
    return this.prefix + this.generateFakeBodyFromPlain(plain)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const expected = await this.generate(plain)

    return expected === hash
  }
}
