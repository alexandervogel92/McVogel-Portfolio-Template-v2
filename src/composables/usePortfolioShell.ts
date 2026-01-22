import type { AccentOption, Locale, LocaleContent } from '@/types/portfolio'
import { computed, onMounted, ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import deLocale from '@/locales/de.json' with { type: 'json' }
import enLocale from '@/locales/en.json' with { type: 'json' }

const translations: Record<Locale, LocaleContent> = {
  en: enLocale as LocaleContent,
  de: deLocale as LocaleContent,
}

const branding = {
  name: 'John Doe',
  initials: 'JD',
}

const accentPalette: AccentOption[] = [
  {
    id: 'violet',
    hex: '#715AFF',
    label: { en: 'Violet', de: 'Violett' },
  },
  {
    id: 'teal',
    hex: '#0EA5E9',
    label: { en: 'Teal', de: 'Türkis' },
  },
  {
    id: 'amber',
    hex: '#F59E0B',
    label: { en: 'Amber', de: 'Bernstein' },
  },
  {
    id: 'orchid',
    hex: '#F472B6',
    label: { en: 'Pink', de: 'Pink' },
  },
]

const defaultAccent: AccentOption = accentPalette[0] ?? {
  id: 'violet',
  hex: '#715AFF',
  label: { en: 'Violet', de: 'Violett' },
}

export function usePortfolioShell () {
  const locale = ref<Locale>('de')
  const theme = useTheme()
  const themeName = ref<'portfolioLight' | 'portfolioDark'>('portfolioLight')
  const accentId = ref(defaultAccent.id)

  if (typeof document !== 'undefined') {
    const docLang = document.documentElement.lang?.toLowerCase()
    locale.value = docLang === 'en' ? 'en' : 'de'
  }

  const current = computed(() => translations[locale.value])
  const accentOptions = computed(() =>
    accentPalette.map(option => ({
      id: option.id,
      hex: option.hex,
      label: option.label[locale.value],
    })),
  )
  const activeAccentLabel = computed(() => {
    const fallback = defaultAccent.label[locale.value]
    return accentOptions.value.find(option => option.id === accentId.value)?.label ?? fallback
  })

  const accentActivatorLabel = computed(
    () => `${current.value.settings.accentLabel}: ${activeAccentLabel.value}`,
  )
  const accentMenuHeading = computed(() => current.value.settings.heading)
  const accentMenuHint = computed(() => current.value.settings.accentHint)
  const languageAriaLabel = computed(() =>
    `${current.value.settings.languageLabel}: ${locale.value === 'de' ? 'Deutsch' : 'English'}`,
  )
  const themeAriaLabel = computed(() =>
    `${current.value.settings.themeLabel}: ${themeName.value === 'portfolioLight' ? 'dark' : 'light'}`,
  )
  const navMenuLabel = computed(() =>
    locale.value === 'de' ? 'Navigation öffnen' : 'Open navigation menu',
  )
  const themeIcon = computed(() =>
    themeName.value === 'portfolioLight' ? 'mdi-weather-night' : 'mdi-white-balance-sunny',
  )
  const brandRole = computed(() => current.value.hero.badge)

  watch(
    themeName,
    value => {
      if (typeof (theme as { change?: (name: string) => void }).change === 'function') {
        (theme as { change: (name: string) => void }).change(value)
      } else {
        theme.global.name.value = value
      }
    },
    { immediate: true },
  )

  watch(
    locale,
    value => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = value
      }
    },
  )

  watch(
    accentId,
    value => {
      const color = accentPalette.find(option => option.id === value)?.hex ?? defaultAccent.hex
      applyAccent(color)
    },
    { immediate: true },
  )

  onMounted(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      themeName.value = 'portfolioDark'
    }
  })

  const toggleTheme = () => {
    themeName.value = themeName.value === 'portfolioLight' ? 'portfolioDark' : 'portfolioLight'
  }

  const toggleLocale = () => {
    locale.value = locale.value === 'de' ? 'en' : 'de'
  }

  function applyAccent (hex: string) {
    if (typeof document === 'undefined') {
      return
    }
    document.documentElement.style.setProperty('--accent-color', hex)
    const rgb = hexToRgb(hex)
    if (rgb) {
      document.documentElement.style.setProperty('--accent-color-rgb', rgb.join(','))
    }
  }

  function hexToRgb (hex: string) {
    const normalised = hex.replace('#', '')
    if (normalised.length !== 6) {
      return null
    }
    const numeric = Number.parseInt(normalised, 16)
    return [
      (numeric >> 16) & 255,
      (numeric >> 8) & 255,
      numeric & 255,
    ]
  }

  return {
    accentActivatorLabel,
    accentId,
    accentMenuHeading,
    accentMenuHint,
    accentOptions,
    brandRole,
    branding,
    current,
    languageAriaLabel,
    locale,
    navMenuLabel,
    themeAriaLabel,
    themeIcon,
    themeName,
    toggleLocale,
    toggleTheme,
  }
}
