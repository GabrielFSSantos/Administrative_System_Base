import { UserAuth } from '@/domain/auth/entities/user-auth'

export abstract class UserAuthsRepository {
  abstract findByEmail(email: string): Promise<UserAuth | null>
}
