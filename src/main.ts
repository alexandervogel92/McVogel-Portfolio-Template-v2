import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@/plugins'
import '@/styles/tokens.scss'
import 'flag-icons/css/flag-icons.min.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
