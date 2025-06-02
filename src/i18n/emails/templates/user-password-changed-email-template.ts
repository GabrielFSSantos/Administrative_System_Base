import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

export const userPasswordChangedEmailTemplate: Record<
  SupportedLocale,
  {
    subject: string
    title: string
    body: (name: string, date: string) => string
  }
> = {
  [SupportedLocale.PT_BR]: {
    subject: 'Sua senha foi alterada',
    title: 'Alteração de senha',
    body: (name, date) =>
      `Olá ${name}, sua senha foi alterada em ${date}. Se não foi você, entre em contato conosco imediatamente.`,
  },
  [SupportedLocale.EN_US]: {
    subject: 'Your password has been changed',
    title: 'Password change',
    body: (name, date) =>
      `Hello ${name}, your password was changed on ${date}. If this wasn’t you, please contact us immediately.`,
  },
}
