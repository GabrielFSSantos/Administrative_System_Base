export const Permissions = {
  USERS: {
    CREATE: 'create_user',
    EDIT: 'edit_user',
    DELETE: 'delete_user',
    VIEW: 'view_user',
  },
  SESSIONS: {
    CREATE: 'create_session',
    REVOKE: 'revoke_session',
  },
} as const

type DeepValueOf<T> = T extends object ? DeepValueOf<T[keyof T]> : T
export type PermissionValue = DeepValueOf<typeof Permissions>

export const ALL_PERMISSIONS: PermissionValue[] = Object.values(Permissions)
  .flatMap((group) => Object.values(group))
