import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

export const systemAdminActivatedEmailTemplate: Record<
  SupportedLocale,
  {
    subject: string
    title: string
    body: (name: string, date: string) => string
  }
> = {
  [SupportedLocale.PT_BR]: {
    subject: 'Você foi ativado como administrador do sistema',
    title: 'Acesso de administrador liberado',
    body: (name, date) =>
      `Olá ${name}, seu acesso como administrador do sistema foi ativado em ${date}. Você já pode acessar todas as funcionalidades administrativas disponíveis.`,
  },
  [SupportedLocale.EN_US]: {
    subject: 'You have been activated as a system administrator',
    title: 'Administrator access granted',
    body: (name, date) =>
      `Hello ${name}, your access as a system administrator was activated on ${date}. You can now access all available administrative features.`,
  },
}
