<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import CartaCard from '../components/CartaCard.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { FileText, Table } from 'lucide-vue-next'

const cartas = ref([])
const carregando = ref(true)
const selectedCartas = ref([])

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

const toggleSelection = (carta) => {
  const index = selectedCartas.value.findIndex(c => c.id === carta.id)
  
  if (index > -1) {
    selectedCartas.value.splice(index, 1)
  } else {
    if (selectedCartas.value.length > 0) {
      const firstAdm = selectedCartas.value[0].administradora
      if (carta.administradora !== firstAdm) {
        alert("Atenção: Você só pode somar cartas da mesma administradora!")
        return
      }
    }
    selectedCartas.value.push(carta)
  }
}

const totals = computed(() => {
  return selectedCartas.value.reduce((acc, curr) => {
    acc.credito += parseFloat(curr.valor_credito)
    acc.entrada += parseFloat(curr.valor_entrada)
    acc.parcelas += parseFloat(curr.valor_parcela)
    return acc
  }, { credito: 0, entrada: 0, parcelas: 0 })
})

const isSelectionDisabled = (carta) => {
  if (carta.status !== 'DISPONIVEL') return true
  if (selectedCartas.value.length === 0) return false
  return selectedCartas.value[0].administradora !== carta.administradora
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
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
          <div class="results-meta">
            <span class="badge">{{ cartasFiltradas.length }} cartas</span>
            <div class="download-btns">
              <button class="btn-download" @click="downloadPDF"><FileText size="18"/> PDF</button>
              <button class="btn-download excel" @click="downloadExcel"><Table size="18"/> Excel</button>
            </div>
          </div>
        </div>

        <div class="cards-list">
          <CartaCard 
            v-for="carta in cartasFiltradas" 
            :key="carta.id" 
            :carta="carta" 
            :selected="selectedCartas.some(c => c.id === carta.id)"
            :disabled="isSelectionDisabled(carta)"
            @toggle-selection="toggleSelection"
          />
        </div>
      </div>

      <Transition name="slide-up">
        <div v-if="selectedCartas.length > 0" class="summary-bar">
          <div class="summary-content">
            <div class="summary-left">
              <div class="count-circle">{{ selectedCartas.length }}</div>
              <div class="summary-label">
                <strong>Cartas Selecionadas</strong>
                <span>Mesma Administradora</span>
              </div>
            </div>
            <div class="summary-values">
              <div class="val-group">
                <span class="v-label">Total Crédito</span>
                <span class="v-val">{{ formatCurrency(totals.credito) }}</span>
              </div>
              <div class="val-group">
                <span class="v-label">Total Entrada</span>
                <span class="v-val highlight-yellow">{{ formatCurrency(totals.entrada) }}</span>
              </div>
              <div class="val-group hide-mobile">
                <span class="v-label">Total Parcelas</span>
                <span class="v-val">{{ formatCurrency(totals.parcelas) }}</span>
              </div>
            </div>
            <button class="btn-clear-selection" @click="selectedCartas = []">Limpar</button>
          </div>
        </div>
      </Transition>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.home-container { background-color: #f3f4f6; min-height: 100vh; }
.hero-section { height: 350px; background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'); background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: white; }
.hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.4)); }
.hero-content { position: relative; z-index: 1; padding: 0 20px; }
.hero-content h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 16px; text-shadow: 0 4px 6px rgba(0,0,0,0.3); }
.hero-content p { font-size: 1.25rem; max-width: 600px; margin: 0 auto; opacity: 0.9; }

.filter-section-wrapper { margin-top: -50px; position: relative; z-index: 10; padding: 0 20px; }
.filter-bar { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; align-items: end; }
.filter-group { display: flex; flex-direction: column; gap: 8px; }
.filter-group label { font-size: 0.85rem; font-weight: 700; color: #374151; text-transform: uppercase; }
.filter-group input, .filter-group select { padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 0.95rem; transition: all 0.2s; }
.filter-group input:focus, .filter-group select:focus { border-color: #1e3a8a; outline: none; box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1); }
.range-inputs { display: flex; align-items: center; gap: 8px; }
.range-inputs input { width: 100%; }
.separator { color: #9ca3af; }

.btn-clean { background: #f3f4f6; color: #4b5563; padding: 12px 24px; border-radius: 12px; font-weight: 700; }
.btn-clean:hover { background: #e5e7eb; color: #111827; }

.quick-categories { max-width: 1200px; margin: 60px auto 40px; padding: 0 20px; text-align: center; }
.quick-categories h3 { font-size: 1.5rem; color: #111827; font-weight: 800; margin-bottom: 24px; }
.categories-grid { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
.cat-card { background: white; padding: 20px 40px; border-radius: 20px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 12px; transition: all 0.3s; border: 2px solid transparent; min-width: 160px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.cat-card .icon-box { width: 48px; height: 48px; background: #f3f4f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #1e3a8a; transition: all 0.3s; }
.cat-card .icon-box svg { width: 24px; height: 24px; }
.cat-card span { font-weight: 700; color: #4b5563; }
.cat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-color: #1e3a8a; }
.cat-card.active { background: #1e3a8a; border-color: #1e3a8a; }
.cat-card.active .icon-box { background: rgba(255,255,255,0.2); color: white; }
.cat-card.active span { color: white; }

.main-content { max-width: 1200px; margin: 0 auto; padding: 40px 20px 150px; }
.results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.results-header h2 { font-size: 1.8rem; font-weight: 800; color: #111827; }
.results-meta { display: flex; align-items: center; gap: 20px; }
.badge { background: #1e3a8a; color: white; padding: 6px 16px; border-radius: 99px; font-size: 0.85rem; font-weight: 700; }
.download-btns { display: flex; gap: 10px; }
.btn-download { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.9rem; font-weight: 700; color: #4b5563; }
.btn-download:hover { border-color: #1e3a8a; color: #1e3a8a; }
.btn-download.excel:hover { border-color: #16a34a; color: #16a34a; }

.cards-list { display: flex; flex-direction: column; gap: 20px; }

.loading { text-align: center; padding: 80px 0; color: #6b7280; }
.spinner { width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top-color: #1e3a8a; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; background: white; padding: 60px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.empty-icon { font-size: 4rem; margin-bottom: 20px; }
.empty-state h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
.empty-state p { color: #6b7280; margin-bottom: 24px; }
.btn-link { color: #1e3a8a; font-weight: 700; text-decoration: underline; background: none; border: none; cursor: pointer; }

.summary-bar { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 95%; max-width: 1000px; background: #1e3a8a; border-radius: 20px; padding: 20px 30px; color: white; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); z-index: 1000; }
.summary-content { display: flex; justify-content: space-between; align-items: center; gap: 30px; }
.summary-left { display: flex; align-items: center; gap: 15px; border-right: 1px solid rgba(255,255,255,0.2); padding-right: 25px; }
.count-circle { width: 45px; height: 45px; background: white; color: #1e3a8a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 900; }
.summary-label { display: flex; flex-direction: column; }
.summary-label strong { font-size: 1.1rem; }
.summary-label span { font-size: 0.75rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }
.summary-values { flex: 1; display: flex; justify-content: space-around; gap: 20px; }
.val-group { display: flex; flex-direction: column; }
.v-label { font-size: 0.75rem; opacity: 0.8; text-transform: uppercase; margin-bottom: 2px; }
.v-val { font-size: 1.2rem; font-weight: 800; white-space: nowrap; }
.highlight-yellow { color: #F6D001; }
.btn-clear-selection { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 10px 20px; border-radius: 10px; font-weight: 700; transition: all 0.2s; }
.btn-clear-selection:hover { background: white; color: #1e3a8a; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translate(-50%, 100%); opacity: 0; }

@media (max-width: 1024px) { 
  .hero-content h1 { font-size: 2.5rem; } 
  .summary-content { gap: 15px; }
  .summary-left { padding-right: 15px; }
  .v-val { font-size: 1rem; }
}

@media (max-width: 768px) { 
  .hero-section { height: 280px; } 
  .hero-content h1 { font-size: 2rem; } 
  .filter-bar { grid-template-columns: 1fr; padding: 20px; } 
  .results-header { flex-direction: column; align-items: flex-start; gap: 15px; } 
  .hide-mobile { display: none; }
  .summary-bar { padding: 15px; border-radius: 15px; }
  .summary-left { border-right: none; padding-right: 0; }
  .summary-label { display: none; }
  .summary-values { justify-content: flex-start; }
}
</style>