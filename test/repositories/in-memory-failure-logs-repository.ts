import { FailureLog } from '@/domain/failure-logs/entities/failure-log'
import { FailureLogsRepositoryContract } from '@/domain/failure-logs/repositories/contracts/failure-logs-repository-contract'

export class InMemoryFailureLogsRepository implements FailureLogsRepositoryContract {
  public items: FailureLog[] = []

  async create(log: FailureLog): Promise<void> {
    this.items.push(log)
  }

  async findById(id: string): Promise<FailureLog | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findMany(params?: {
    context?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): Promise<{ failureLog: FailureLog[]; total: number }> {
    let results = [...this.items]

    if (params?.context) {
      results = results.filter((log) =>
        log.context.value.toLowerCase().includes(params.context!.toLowerCase()),
      )
    }

    if (params?.startDate) {
      results = results.filter((log) => log.createdAt >= params.startDate!)
    }

    if (params?.endDate) {
      results = results.filter((log) => log.createdAt <= params.endDate!)
    }

    const total = results.length

    if (params?.offset !== undefined || params?.limit !== undefined) {
      const offset = params.offset ?? 0
      const limit = params.limit ?? total

      results = results.slice(offset, offset + limit)
    }

    return {
      failureLog: results,
      total,
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }
}
