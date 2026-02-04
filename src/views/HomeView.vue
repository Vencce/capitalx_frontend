<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import CartaCard from '../components/CartaCard.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { FileText, Table } from 'lucide-vue-next'

const cartas = ref([])
const carregando = ref(true)

// Filtros
const filtroTipo = ref('')
const filtroAdmin = ref('')
const creditoMin = ref('')
const creditoMax = ref('')
const entradaMin = ref('')
const entradaMax = ref('')

const buscarCartas = async () => {
  try {
    const response = await api.get('cartas/')
    cartas.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    carregando.value = false
  }
}

const cartasFiltradas = computed(() => {
  return cartas.value.filter(c => {
    if (filtroTipo.value && c.tipo !== filtroTipo.value) return false
    if (filtroAdmin.value && !c.administradora_detalhes.nome.toLowerCase().includes(filtroAdmin.value.toLowerCase())) return false
    
    const valorCredito = parseFloat(c.valor_credito)
    if (creditoMin.value && valorCredito < parseFloat(creditoMin.value)) return false
    if (creditoMax.value && valorCredito > parseFloat(creditoMax.value)) return false

    const valorEntrada = parseFloat(c.valor_entrada)
    if (entradaMin.value && valorEntrada < parseFloat(entradaMin.value)) return false
    if (entradaMax.value && valorEntrada > parseFloat(entradaMax.value)) return false

    if (c.status !== 'DISPONIVEL') return false

    return true
  })
})

const getApiUrl = (endpoint) => {
  const params = new URLSearchParams()
  if (filtroTipo.value) params.append('tipo', filtroTipo.value)
  const baseUrl = 'http://localhost:8000/api' 
  return `${baseUrl}/${endpoint}/?${params.toString()}`
}

const downloadPDF = () => window.open(getApiUrl('exportar/pdf'), '_blank')
const downloadExcel = () => window.open(getApiUrl('exportar/excel'), '_blank')

const selecionarCategoriaRapida = (tipo) => {
  filtroTipo.value = tipo
  const el = document.getElementById('resultados')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const limparFiltros = () => {
  filtroTipo.value = ''
  filtroAdmin.value = ''
  creditoMin.value = ''
  creditoMax.value = ''
  entradaMin.value = ''
  entradaMax.value = ''
}

onMounted(buscarCartas)
</script>

<template>
  <div class="home-container">
    <AppHeader />

    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Oportunidades Exclusivas</h1>
        <p>Encontre a carta contemplada ideal para realizar seu sonho com economia e agilidade.</p>
      </div>
    </section>

    <div class="filter-section-wrapper">
      <div class="filter-bar">
        
        <div class="filter-group">
          <label>Tipo de Bem</label>
          <div class="input-wrapper">
            <select v-model="filtroTipo">
              <option value="">Todos os tipos</option>
              <option value="IMOVEL">Imóvel</option>
              <option value="AUTOMOVEL">Automóvel</option>
            </select>
          </div>
        </div>

        <div class="filter-group">
          <label>Crédito (R$)</label>
          <div class="range-inputs">
            <input type="number" v-model="creditoMin" placeholder="Mín" />
            <span class="separator">-</span>
            <input type="number" v-model="creditoMax" placeholder="Máx" />
          </div>
        </div>

        <div class="filter-group">
          <label>Entrada (R$)</label>
          <div class="range-inputs">
            <input type="number" v-model="entradaMin" placeholder="Mín" />
            <span class="separator">-</span>
            <input type="number" v-model="entradaMax" placeholder="Máx" />
          </div>
        </div>

        <div class="filter-group">
          <label>Administradora</label>
          <input type="text" v-model="filtroAdmin" placeholder="Ex: Caixa, Bradesco..." />
        </div>

        <div class="filter-actions">
            <button class="btn-clean" @click="limparFiltros" title="Limpar Filtros">
                Limpar
            </button>
        </div>
      </div>
    </div>

    <section class="quick-categories">
      <h3>Navegue por categoria</h3>
      <div class="categories-grid">
        <div class="cat-card" @click="selecionarCategoriaRapida('IMOVEL')" :class="{ active: filtroTipo === 'IMOVEL' }">
          <div class="icon-box">
            <svg viewBox="0 0 24 24" fill="currentColor">
               <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <span>Imóveis</span>
        </div>

        <div class="cat-card" @click="selecionarCategoriaRapida('AUTOMOVEL')" :class="{ active: filtroTipo === 'AUTOMOVEL' }">
          <div class="icon-box">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <span>Veículos</span>
        </div>
      </div>
    </section>

    <main class="main-content" id="resultados">
      <div v-if="carregando" class="loading">
        <div class="spinner"></div>
        <p>Carregando oportunidades...</p>
      </div>

      <div v-else-if="cartasFiltradas.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Nenhuma carta encontrada</h3>
        <p>Tente ajustar os filtros.</p>
        <button @click="limparFiltros" class="btn-link">Limpar filtros</button>
      </div>

      <div v-else class="results-container">
        <div class="results-header">
          <h2>Resultados disponíveis</h2>
          <span class="badge">{{ cartasFiltradas.length }} cartas</span>
        </div>

        <div class="download-section">
          <button @click="downloadPDF" class="btn-download">
            <FileText :size="18" /> Baixar PDF
          </button>
          <button @click="downloadExcel" class="btn-download">
            <Table :size="18" /> Baixar Excel
          </button>
        </div>
        
        <div class="cards-list">
          <CartaCard v-for="carta in cartasFiltradas" :key="carta.id" :carta="carta" />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.home-container { min-height: 100vh; display: flex; flex-direction: column; background-color: #f3f4f6; font-family: 'Segoe UI', sans-serif; }

/* VARIÁVEL DA LOGO */
.home-container {
  --brand-blue: #1e3a8a;
  --brand-logo: #F6D001; /* Cor da Logo */
  --text-dark: #1e293b;
}

/* HERO */
.hero-section { position: relative; height: 450px; background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; text-align: center; color: white; }
.hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(17, 24, 39, 0.7) 100%); }
.hero-content { position: relative; z-index: 2; margin-bottom: 60px; max-width: 800px; padding: 0 20px; animation: fadeIn 0.8s ease-out; }
.hero-content h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; letter-spacing: -1px; line-height: 1.1; }
.hero-content p { font-size: 1.25rem; font-weight: 300; opacity: 0.9; }

/* FILTROS */
.filter-section-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 10; margin-top: -60px; }
.filter-bar { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-end; }
.filter-group { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 8px; }
.filter-group label { font-size: 0.85rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px; }

.filter-group select, .filter-group input[type="text"], .range-inputs input {
  padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; width: 100%; background-color: #fff; transition: all 0.2s; color: #1f2937; height: 48px;
}

/* FOCO EM AMARELO LOGO */
.filter-group select:focus, .filter-group input:focus { 
  border-color: var(--brand-logo); 
  outline: none; 
  box-shadow: 0 0 0 3px rgba(246, 208, 1, 0.2); 
}

.range-inputs { display: flex; align-items: center; gap: 8px; }
.separator { color: #9ca3af; font-weight: bold; }
.filter-actions { flex: 0 0 auto; }
.btn-clean { background: transparent; color: #ef4444; border: 1px solid #fecaca; padding: 0 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; height: 48px; }
.btn-clean:hover { background: #fef2f2; border-color: #ef4444; }

/* CATEGORIAS */
.quick-categories { text-align: center; padding: 60px 20px 40px; }
.quick-categories h3 { color: #6b7280; margin-bottom: 30px; font-weight: 600; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; }
.categories-grid { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }

.cat-card {
  width: 160px; padding: 20px; background: white; border-radius: 16px; display: flex; flex-direction: column; align-items: center; gap: 15px;
  cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 2px solid transparent;
}
.icon-box {
  width: 60px; height: 60px; background: #f1f5f9;
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  transition: all 0.3s; color: var(--brand-blue);
}
.cat-card svg { width: 30px; height: 30px; fill: currentColor; }
.cat-card span { font-weight: 600; color: #374151; font-size: 1rem; transition: color 0.3s; }

.cat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }

/* ESTADO ATIVO - AMARELO LOGO */
.cat-card.active { border-color: var(--brand-logo); background: #FFFBEB; }
.cat-card.active .icon-box { background: var(--brand-logo); color: #1e293b; box-shadow: 0 4px 10px rgba(246, 208, 1, 0.4); }
.cat-card.active span { color: #1e293b; font-weight: 700; }

/* RESULTADOS & BADGE */
.main-content { max-width: 1200px; margin: 0 auto; padding: 20px 20px 80px; width: 100%; flex: 1; }
.results-header { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px; }
.results-header h2 { font-size: 1.5rem; font-weight: 700; color: #111827; }

/* BADGE COM A COR DA LOGO */
.badge { 
  background: var(--brand-logo); 
  color: #1e293b; /* Texto escuro para contraste no amarelo vivo */
  padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 800;
}

.download-section { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; }
.btn-download { display: flex; align-items: center; gap: 8px; background-color: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
.btn-download:hover { background-color: #cbd5e1; color: #1e293b; transform: translateY(-2px); }

.cards-list { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 900px; margin: 0 auto; }
.empty-state { text-align: center; padding: 80px 20px; background: white; border-radius: 16px; max-width: 600px; margin: 0 auto; }
.empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }
.btn-link { background: none; border: none; color: var(--brand-blue); font-weight: 600; margin-top: 20px; cursor: pointer; text-decoration: underline; }

.loading { text-align: center; padding: 100px 0; color: #6b7280; }
.spinner { width: 50px; height: 50px; border: 4px solid #e5e7eb; border-top: 4px solid var(--brand-logo); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.5rem; }
  .filter-section-wrapper { margin-top: -30px; }
}
</style>