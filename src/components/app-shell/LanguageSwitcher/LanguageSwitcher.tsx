import classNames from 'class-names'
import { Check, Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supportedLanguages, type LanguageCode } from '@/i18n/languages'
import { IconButton } from '@/components/shared/ui/IconButton'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const language = i18n.resolvedLanguage ?? i18n.language
  const languageCode = language.split('-')[0].toUpperCase()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleLanguageChange(code: LanguageCode) {
    void i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <IconButton
        className="w-auto gap-1.5 px-3"
        aria-label={t('language.openMenu')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Globe aria-hidden="true" size={20} />
        <span aria-hidden="true" className="text-xs font-semibold tracking-wide">
          {languageCode}
        </span>
      </IconButton>
      {isOpen ? (
        <div
          className="absolute right-0 z-10 mt-2 min-w-40 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1 shadow-lg"
          role="menu"
          aria-label={t('language.label')}
        >
          {supportedLanguages.map(({ code, name }) => (
            <button
              key={code}
              className={classNames(
                'flex min-h-11 w-full cursor-pointer items-center justify-between rounded-lg px-3 text-left text-sm text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]',
                language === code && 'bg-[var(--color-background)] font-semibold',
              )}
              type="button"
              role="menuitemradio"
              aria-checked={language === code}
              onClick={() => handleLanguageChange(code)}
            >
              {name}
              {language === code ? <Check aria-hidden="true" size={18} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
