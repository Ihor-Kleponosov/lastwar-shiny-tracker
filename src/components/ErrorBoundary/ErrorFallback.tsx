import { useTranslation } from 'react-i18next'

export function ErrorFallback() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4 text-[var(--color-text-primary)]">
      <section
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[0_8px_24px_rgb(0_0_0_/_14%)]"
        role="alert"
      >
        <h1 className="text-xl font-semibold">{t('errorBoundary.message')}</h1>
      </section>
    </main>
  )
}
