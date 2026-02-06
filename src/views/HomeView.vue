<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import CartaCard from '../components/CartaCard.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import ModalJuncao from '../components/ModalJuncao.vue'
import { FileText, Table, PlusCircle, Filter, X } from 'lucide-vue-next'

const cartas = ref([])
const carregando = ref(true)
const selectedCartas = ref([])
const showModalJuncao = ref(false)
const showMobileFilters = ref(false) // Controle para filtros no mobile

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
  const index = selectedCartas.value.findIndex((c) => c.id === carta.id)

  if (index > -1) {
    selectedCartas.value.splice(index, 1)
  } else {
    if (selectedCartas.value.length > 0) {
      const firstCarta = selectedCartas.value[0]
      if (carta.administradora !== firstCarta.administradora) {
        alert('Atenção: Você só pode somar cartas da mesma administradora!')
        return
      }
      if (carta.tipo !== firstCarta.tipo) {
        alert(`Atenção: Não é possível misturar categorias.`)
        return
      }
    }
    selectedCartas.value.push(carta)
  }
}

const totals = computed(() => {
  return selectedCartas.value.reduce(
    (acc, curr) => {
      acc.credito += parseFloat(curr.valor_credito)
      acc.entrada += parseFloat(curr.valor_entrada)
      acc.parcelas += parseFloat(curr.valor_parcela)
      return acc
    },
    { credito: 0, entrada: 0, parcelas: 0 },
  )
})

const isSelectionDisabled = (carta) => {
  if (carta.status !== 'DISPONIVEL') return true
  if (selectedCartas.value.length === 0) return false
  const firstCarta = selectedCartas.value[0]
  return firstCarta.administradora !== carta.administradora || firstCarta.tipo !== carta.tipo
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const cartasFiltradas = computed(() => {
  return cartas.value.filter((c) => {
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
      <div class="hero-content">
        <h1>Cartas <span>Contempladas</span></h1>
        <p>A forma mais inteligente de conquistar seu bem com segurança.</p>
      </div>
    </section>

    <div class="filter-section-wrapper">
      <button class="mobile-filter-toggle" @click="showMobileFilters = !showMobileFilters">
        <Filter size="18" /> {{ showMobileFilters ? 'Fechar Filtros' : 'Filtrar Oportunidades' }}
      </button>

      <div class="filter-bar" :class="{ 'is-visible': showMobileFilters }">
        <div class="filter-group">
          <label>Tipo de Bem</label>
          <select v-model="filtroTipo">
            <option value="">Todos os tipos</option>
            <option value="IMOVEL">Imóvel</option>
            <option value="AUTOMOVEL">Automóvel</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Crédito (R$)</label>
          <div class="range-inputs">
            <input type="number" v-model="creditoMin" placeholder="Mín" />
            <input type="number" v-model="creditoMax" placeholder="Máx" />
          </div>
        </div>
        <div class="filter-group">
          <label>Entrada (R$)</label>
          <div class="range-inputs">
            <input type="number" v-model="entradaMin" placeholder="Mín" />
            <input type="number" v-model="entradaMax" placeholder="Máx" />
          </div>
        </div>
        <div class="filter-group">
          <label>Administradora</label>
          <input type="text" v-model="filtroAdmin" placeholder="Ex: Caixa, Bradesco..." />
        </div>
        <div class="filter-actions">
          <button class="btn-clean" @click="limparFiltros">Limpar</button>
        </div>
      </div>
    </div>

    <section class="quick-categories">
      <div class="categories-grid">
        <div class="cat-card" @click="selecionarCategoriaRapida('IMOVEL')" :class="{ active: filtroTipo === 'IMOVEL' }">
          <div class="icon-box">🏠</div>
          <span>Imóveis</span>
        </div>
        <div class="cat-card" @click="selecionarCategoriaRapida('AUTOMOVEL')" :class="{ active: filtroTipo === 'AUTOMOVEL' }">
          <div class="icon-box">🚗</div>
          <span>Veículos</span>
        </div>
      </div>
    </section>

    <main class="main-content" id="resultados">
      <div v-if="carregando" class="loading">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>

      <div v-else class="results-container">
        <div class="results-header">
          <h2>Oportunidades</h2>
          <div class="results-meta">
            <span class="count-badge">{{ cartasFiltradas.length }} disponíveis</span>
            <div class="download-btns">
              <button class="btn-download" @click="downloadPDF"><FileText size="16" /> PDF</button>
              <button class="btn-download excel" @click="downloadExcel"><Table size="16" /> Excel</button>
            </div>
          </div>
        </div>

        <div class="cards-list">
          <CartaCard
            v-for="carta in cartasFiltradas"
            :key="carta.id"
            :carta="carta"
            :selected="selectedCartas.some((c) => c.id === carta.id)"
            :disabled="isSelectionDisabled(carta)"
            @toggle-selection="toggleSelection"
          />
        </div>
      </div>

      <Transition name="slide-up">
        <div v-if="selectedCartas.length > 0" class="summary-bar">
          <div class="summary-content">
            <div class="summary-main-info">
              <div class="badge-count">{{ selectedCartas.length }}</div>
              <div class="total-info">
                <span>Total Crédito</span>
                <strong>{{ formatCurrency(totals.credito) }}</strong>
              </div>
            </div>
            
            <div class="summary-actions">
              <button class="btn-clear" @click="selectedCartas = []">Limpar</button>
              <button v-if="selectedCartas.length > 1" class="btn-juncao-trigger" @click="showModalJuncao = true">
                Ver Junção
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <ModalJuncao :show="showModalJuncao" :cartas="selectedCartas" @close="showModalJuncao = false" />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.home-container { background-color: #f8fafc; min-height: 100vh; }

/* Hero Moderno e Responsivo */
.hero-section {
  height: 300px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  display: flex; align-items: center; justify-content: center;
  text-align: center; color: white; padding: 0 20px;
}
.hero-content h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 10px; }
.hero-content h1 span { color: #F6D001; }
.hero-content p { font-size: 1.1rem; opacity: 0.8; max-width: 500px; margin: 0 auto; }

/* Filtros */
.filter-section-wrapper { margin-top: -40px; padding: 0 20px; z-index: 100; position: relative; }
.filter-bar {
  background: white; border-radius: 16px; padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px; max-width: 1200px; margin: 0 auto;
}

.mobile-filter-toggle { display: none; width: 100%; padding: 15px; background: #1e3a8a; color: white; border: none; border-radius: 12px; font-weight: 700; margin-bottom: 10px; gap: 10px; align-items: center; justify-content: center; }

.filter-group { display: flex; flex-direction: column; gap: 8px; }
.filter-group label { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; }
.filter-group input, .filter-group select { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; transition: 0.3s; }
.filter-group input:focus { border-color: #F6D001; }
.range-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.btn-clean { background: #f1f5f9; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; color: #64748b; }

/* Categorias */
.quick-categories { margin: 40px auto; padding: 0 20px; max-width: 1200px; }
.categories-grid { display: flex; gap: 15px; justify-content: center; }
.cat-card { background: white; padding: 15px 25px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px; border: 2px solid transparent; transition: 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
.cat-card.active { border-color: #F6D001; background: #fffbeb; }
.cat-card span { font-weight: 700; color: #1e3a8a; }

/* Resultados */
.main-content { max-width: 1200px; margin: 0 auto; padding: 0 20px 100px; }
.results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px; }
.count-badge { background: #e0f2fe; color: #0369a1; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
.download-btns { display: flex; gap: 8px; }
.btn-download { display: flex; align-items: center; gap: 6px; padding: 8px 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; }

.cards-list { display: grid; gap: 20px; }

/* Barra de Junção Fixa no Mobile */
.summary-bar {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  width: calc(100% - 40px); max-width: 800px;
  background: #0f172a; border-radius: 16px; padding: 15px 20px;
  color: white; z-index: 1000; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.summary-content { display: flex; justify-content: space-between; align-items: center; gap: 15px; }
.summary-main-info { display: flex; align-items: center; gap: 15px; }
.badge-count { width: 35px; height: 35px; background: #F6D001; color: #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; }
.total-info { display: flex; flex-direction: column; }
.total-info span { font-size: 0.7rem; opacity: 0.7; text-transform: uppercase; }
.total-info strong { font-size: 1.1rem; color: #F6D001; }

.summary-actions { display: flex; gap: 10px; }
.btn-clear { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 15px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.8rem; }
.btn-juncao-trigger { background: #F6D001; color: #0f172a; border: none; padding: 8px 20px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 0.9rem; }

/* Responsividade Geral */
@media (max-width: 768px) {
  .hero-section { height: 220px; }
  .mobile-filter-toggle { display: flex; }
  .filter-bar { 
    display: none; /* Esconde filtros por padrão no mobile */
    grid-template-columns: 1fr; 
    position: absolute; width: calc(100% - 40px); top: 60px;
  }
  .filter-bar.is-visible { display: grid; }
  
  .results-header { flex-direction: column; align-items: flex-start; }
  .download-btns { width: 100%; }
  .btn-download { flex: 1; justify-content: center; }

  .summary-bar { bottom: 10px; padding: 12px; }
  .total-info strong { font-size: 1rem; }
  .btn-juncao-trigger { padding: 8px 12px; font-size: 0.8rem; }
}

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translate(-50%, 100%); opacity: 0; }

.loading { text-align: center; padding: 50px; }
.spinner { width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top-color: #F6D001; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>