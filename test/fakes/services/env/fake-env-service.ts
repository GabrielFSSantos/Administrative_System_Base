import { EnvServiceContract } from '@/application/subscribers/emails/services/contracts/env-service-contract'
import { EnvironmentVariables } from '@/application/subscribers/emails/services/contracts/environment-variables'

export class FakeEnvService implements EnvServiceContract {
  private values: Partial<EnvironmentVariables> = {
    DEFAULT_SYSTEM_EMAIL_FROM: 'no-reply@example.com',
  }

  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] {
    const value = this.values[key]

    if (value === undefined) {
      throw new Error(`Missing Environment Variable: ${String(key)}`)
    }

    return value
  }

  set<K extends keyof EnvironmentVariables>(key: K, value: EnvironmentVariables[K]): void {
    this.values[key] = value
  }
}
