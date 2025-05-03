import { Account } from '@/domain/sessions/entities/account'

export abstract class AccountsRepository {
  abstract findById(id: string): Promise<Account | null>
  abstract findByEmail(email: string): Promise<Account | null>
}
