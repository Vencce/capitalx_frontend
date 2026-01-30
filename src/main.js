import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router' // Importe o router

createApp(App)
  .use(router) // Use o router
  .mount('#app')