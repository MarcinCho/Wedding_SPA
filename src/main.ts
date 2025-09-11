import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.component('Counter', () => import('./components/coutdown.vue'))

app.mount('#app')
