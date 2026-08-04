import { useState } from 'react'
import { MainPage } from '@/pages/MainPage'
import { PresetsPage } from '@/pages/PresetsPage'

type AppRoute = 'main' | 'presets'

export default function App() {
  const [route, setRoute] = useState<AppRoute>('main')
  const navigateToMain = () => setRoute('main')

  if (route === 'presets') {
    return <PresetsPage onBack={navigateToMain} onNavigateHome={navigateToMain} />
  }

  return <MainPage onOpenPresets={() => setRoute('presets')} onNavigateHome={navigateToMain} />
}
