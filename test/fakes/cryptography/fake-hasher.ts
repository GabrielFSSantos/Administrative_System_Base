import { HashComparerContract } from '@/core/contracts/cryptography/hash-comparer-contract'
import { HashGeneratorContract } from '@/core/contracts/cryptography/hash-generator-contract'

export class FakeHasher implements HashGeneratorContract, HashComparerContract {
  async generate(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
