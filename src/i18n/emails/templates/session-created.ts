import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

export const sessionCreatedEmailTemplate: Record<
  SupportedLocale,
  {
    subject: string
    title: string
    body: (name: string, date: string) => string
  }
> = {
  [SupportedLocale.PT_BR]: {
    subject: 'Nova sessão iniciada',
    title: 'Novo login detectado',
    body: (name, date) =>
      `Olá ${name}, uma nova sessão foi iniciada na sua conta em ${date}. Se não foi você, recomendamos trocar sua senha imediatamente.`,
  },
  [SupportedLocale.EN_US]: {
    subject: 'New session started',
    title: 'New login detected',
    body: (name, date) =>
      `Hi ${name}, a new session was started on your account at ${date}. If this wasn’t you, we recommend changing your password immediately.`,
  },
}
