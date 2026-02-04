import { createApp } from 'vue'
import { createPinia } from 'pinia' // <--- Importante: Importar o Pinia
import App from './App.vue'
import router from './router'

import './assets/main.css' // Certifique-se de que o CSS global está sendo importado aqui

const app = createApp(App)

app.use(createPinia()) // <--- Importante: Ativar o Pinia antes do router
app.use(router)

app.mount('#app')