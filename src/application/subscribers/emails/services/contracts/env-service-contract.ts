import { EnvironmentVariables } from './environment-variables'

export interface EnvServiceContract {
  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K]
}
