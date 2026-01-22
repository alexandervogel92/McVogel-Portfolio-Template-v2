import type { ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const portfolioLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#f5f7fb',
    surface: '#ffffff',
    primary: '#715AFF',
    secondary: '#0EA5E9',
    accent: '#715AFF',
    info: '#38bdf8',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
}

const portfolioDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0B1220',
    surface: '#111a2d',
    primary: '#8B7BFF',
    secondary: '#38bdf8',
    accent: '#8B7BFF',
    info: '#38bdf8',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'portfolioLight',
    themes: {
      portfolioLight,
      portfolioDark,
    },
  },
})
