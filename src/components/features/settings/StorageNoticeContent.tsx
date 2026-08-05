import { Trans, useTranslation } from 'react-i18next'

export function StorageNoticeContent() {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
      <p className="font-semibold text-[var(--color-text-primary)]">
        {t('settings.serverList.storageNotice.title')}
      </p>
      <p>{t('settings.serverList.storageNotice.introduction')}</p>
      <p>
        <Trans
          i18nKey="settings.serverList.storageNotice.transfer"
          components={{ strong: <strong /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey="settings.serverList.storageNotice.backup"
          components={{ strong: <strong /> }}
        />
      </p>
    </div>
  )
}
