import { FailureLog } from '@/domain/failure-logs/entities/failure-log'

export abstract class FailureLogsRepositoryContract {
  abstract create(log: FailureLog): Promise<void>
  abstract findById(id: string): Promise<FailureLog | null>
  abstract findMany(params?: {
    context?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): Promise<{ failureLog: FailureLog[]; total: number }>
  abstract delete(id: string): Promise<void>
}
