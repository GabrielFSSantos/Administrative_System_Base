export abstract class HashComparerContract {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
