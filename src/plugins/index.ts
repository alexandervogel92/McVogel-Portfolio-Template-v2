import type { App } from 'vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { env } from '@/config/env'
import vuetify from '@/plugins/vuetify'

import router from '@/router'

export function registerPlugins (app: App) {
  const recaptchaKey = env.recaptchaSiteKey

  if (!recaptchaKey) {
    const message = '[reCAPTCHA] VITE_RECAPTCHA_SITE_KEY is not set. Contact form submissions will fail.'
    if (import.meta.env.PROD) {
      console.warn(message)
    } else {
      console.info(message)
    }
  }

  app
    .use(vuetify)
    .use(router)
    .use(VueReCaptcha, {
      siteKey: recaptchaKey ?? '',
      loaderOptions: {
        autoHideBadge: true,
      },
    })
}
