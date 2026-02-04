import { defineStore } from 'pinia'
import api from '../services/api'

export const useConfigStore = defineStore('config', {
  state: () => ({
    whatsapp: '5547999999999', // Valor padrão inicial
    email: '',
    instagram: '',
    facebook: ''
  }),
  actions: {
    async fetchConfig() {
      try {
        const res = await api.get('configuracoes/')
        if (res.data) {
          this.whatsapp = res.data.whatsapp || '5547999999999'
          this.email = res.data.email_contato
          this.instagram = res.data.instagram_link
          this.facebook = res.data.facebook_link
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
  }
})