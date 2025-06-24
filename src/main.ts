import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import 'virtual:uno.css'
import './main.scss'

createApp(App).use(router).mount('#app')
