export abstract class HashGeneratorContract {
  abstract generate(plain: string): Promise<string>
}
