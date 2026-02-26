<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import CartaCard from '../components/CartaCard.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import ModalJuncao from '../components/ModalJuncao.vue'
import { 
  FileText, Table, PlusCircle, Search, 
  Settings2, ChevronDown, ChevronUp, X 
} from 'lucide-vue-next'

const cartas = ref([])
const carregando = ref(true)
const selectedCartas = ref([])
const showModalJuncao = ref(false)
const mostrarFiltrosAvancados = ref(false)

// ESTADOS DOS FILTROS
const buscaGlobal = ref('') // Busca por Código ou Administradora
const filtroTipo = ref('')
const filtroStatus = ref('')
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
      return acc
    },
    { credito: 0, entrada: 0 },
  )
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// LÓGICA DE FILTRAGEM REFINADA
const cartasFiltradas = computed(() => {
  let filtradas = cartas.value.filter((c) => {
    // 1. Busca Global (Código ou Nome da Administradora)
    if (buscaGlobal.value) {
      const termo = buscaGlobal.value.toLowerCase()
      const matchesCodigo = c.codigo.toLowerCase().includes(termo)
      const matchesAdmin = c.administradora_detalhes.nome.toLowerCase().includes(termo)
      if (!matchesCodigo && !matchesAdmin) return false
    }

    // 2. Filtros Básicos
    if (filtroTipo.value && c.tipo !== filtroTipo.value) return false
    if (filtroStatus.value && c.status !== filtroStatus.value) return false

    // 3. Filtros Avançados (Crédito)
    const valorCredito = parseFloat(c.valor_credito)
    if (creditoMin.value && valorCredito < parseFloat(creditoMin.value)) return false
    if (creditoMax.value && valorCredito > parseFloat(creditoMax.value)) return false

    // 4. Filtros Avançados (Entrada)
    const valorEntrada = parseFloat(c.valor_entrada)
    if (entradaMin.value && valorEntrada < parseFloat(entradaMin.value)) return false
    if (entradaMax.value && valorEntrada > parseFloat(entradaMax.value)) return false

    return true
  })

  return filtradas.sort((a, b) => parseFloat(a.valor_credito) - parseFloat(b.valor_credito))
})

const limparFiltros = () => {
  buscaGlobal.value = ''
  filtroTipo.value = ''
  filtroStatus.value = ''
  creditoMin.value = ''
  creditoMax.value = ''
  entradaMin.value = ''
  entradaMax.value = ''
}

const downloadPDF = () => window.open(`https://capitalxinvest.onrender.com/api/exportar/pdf/`, '_blank')
const downloadExcel = () => window.open(`https://capitalxinvest.onrender.com/api/exportar/excel/`, '_blank')

onMounted(buscarCartas)
</script>

<template>
  <div class="home-container">
    <AppHeader />

    <section class="hero-section">
      <div class="hero-content">
        <h1>Oportunidades em Cartas</h1>
        <p>Utilize nossa busca inteligente para encontrar o crédito ideal.</p>
      </div>
    </section>

    <div class="filter-wrapper">
      <div class="filter-card">
        <div class="filter-main-bar">
          <div class="search-input-group">
            <Search class="search-icon" :size="20" />
            <input 
              type="text" 
              v-model="buscaGlobal" 
              placeholder="Pesquisar por Código ou Administradora..." 
            />
          </div>

          <div class="basic-selects">
            <select v-model="filtroTipo">
              <option value="">Tipo de Bem</option>
              <option value="IMOVEL">Imóvel</option>
              <option value="AUTOMOVEL">Automóvel</option>
            </select>

            <select v-model="filtroStatus">
              <option value="">Status</option>
              <option value="DISPONIVEL">Disponível</option>
              <option value="RESERVADO">Reservado</option>
              <option value="VENDIDO">Vendido</option>
            </select>
          </div>

          <button class="btn-toggle-advanced" @click="mostrarFiltrosAvancados = !mostrarFiltrosAvancados">
            <Settings2 :size="18" />
            {{ mostrarFiltrosAvancados ? 'Ocultar Filtros' : 'Filtro Avançado' }}
            <component :is="mostrarFiltrosAvancados ? ChevronUp : ChevronDown" :size="16" />
          </button>
        </div>

        <Transition name="expand">
          <div v-if="mostrarFiltrosAvancados" class="advanced-panel">
            <div class="advanced-grid">
              <div class="adv-group">
                <label>Faixa de Crédito (R$)</label>
                <div class="range-inputs">
                  <input type="number" v-model="creditoMin" placeholder="Mínimo" />
                  <span>até</span>
                  <input type="number" v-model="creditoMax" placeholder="Máximo" />
                </div>
              </div>

              <div class="adv-group">
                <label>Valor de Entrada (R$)</label>
                <div class="range-inputs">
                  <input type="number" v-model="entradaMin" placeholder="Mínimo" />
                  <span>até</span>
                  <input type="number" v-model="entradaMax" placeholder="Máximo" />
                </div>
              </div>
            </div>

            <div class="advanced-actions">
              <button class="btn-clear" @click="limparFiltros">
                <X :size="16" /> Limpar tudo
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <main class="main-content" id="resultados">
      <div v-if="carregando" class="loading">
        <div class="spinner"></div>
        <p>Localizando as melhores cotas...</p>
      </div>

      <div v-else-if="cartasFiltradas.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Nada encontrado por aqui</h3>
        <p>Ajuste sua busca ou filtros para ver outros resultados.</p>
        <button @click="limparFiltros" class="btn-link">Ver todas as cartas</button>
      </div>

      <div v-else class="results-container">
        <div class="results-header">
          <h2>Estoque Disponível</h2>
          <div class="results-meta">
            <span class="count-badge">{{ cartasFiltradas.length }} cartas encontradas</span>
            <div class="export-actions">
              <button class="btn-export" @click="downloadPDF"><FileText size="18" /> PDF</button>
              <button class="btn-export excel" @click="downloadExcel"><Table size="18" /> Excel</button>
            </div>
          </div>
        </div>

        <div class="cards-list">
          <CartaCard
            v-for="carta in cartasFiltradas"
            :key="carta.id"
            :carta="carta"
            :selected="selectedCartas.some((c) => c.id === carta.id)"
            @toggle-selection="toggleSelection"
          />
        </div>
      </div>

      <Transition name="slide-up">
        <div v-if="selectedCartas.length > 0" class="summary-bar">
          <div class="summary-content">
            <div class="sum-left">
              <div class="circle">{{ selectedCartas.length }}</div>
              <div class="label">
                <strong>Cartas Selecionadas</strong>
                <span>Mesma categoria/administradora</span>
              </div>
            </div>
            <div class="sum-values">
              <div class="val-col">
                <small>Crédito Total</small>
                <strong>{{ formatCurrency(totals.credito) }}</strong>
              </div>
              <div class="val-col">
                <small>Entrada Total</small>
                <strong class="yellow">{{ formatCurrency(totals.entrada) }}</strong>
              </div>
            </div>
            <div class="sum-actions">
              <button class="btn-reset" @click="selectedCartas = []">Limpar</button>
              <button v-if="selectedCartas.length > 1" class="btn-juncao" @click="showModalJuncao = true">
                <PlusCircle size="18" /> Ver Junção
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

.hero-section {
  height: 300px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  display: flex; align-items: center; justify-content: center; text-align: center; color: white;
}
.hero-content h1 { font-size: 2.8rem; font-weight: 800; margin-bottom: 12px; }

/* DESIGN DOS FILTROS REINVENTADO */
.filter-wrapper { margin-top: -60px; padding: 0 20px; position: relative; z-index: 100; }
.filter-card { 
  background: white; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  max-width: 1200px; margin: 0 auto; overflow: hidden; border: 1px solid #e2e8f0;
}

.filter-main-bar {
  padding: 20px 30px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}

.search-input-group { 
  flex: 1; min-width: 300px; position: relative; display: flex; align-items: center;
}
.search-icon { position: absolute; left: 16px; color: #94a3b8; }
.search-input-group input {
  width: 100%; padding: 14px 14px 14px 48px; border: 1px solid #e2e8f0; border-radius: 16px;
  font-size: 1rem; transition: 0.2s; background: #f8fafc;
}

.basic-selects { display: flex; gap: 12px; }
.basic-selects select {
  padding: 14px 20px; border: 1px solid #e2e8f0; border-radius: 16px; 
  background: #f8fafc; font-weight: 600; color: #475569; cursor: pointer;
}

.btn-toggle-advanced {
  display: flex; align-items: center; gap: 8px; padding: 14px 20px;
  background: #eff6ff; color: #1e3a8a; border: none; border-radius: 16px;
  font-weight: 700; cursor: pointer; transition: 0.2s;
}

/* PAINEL AVANÇADO */
.advanced-panel { padding: 30px; background: #fdfdfd; border-top: 1px solid #f1f5f9; }
.advanced-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 20px; }
.adv-group label { display: block; font-size: 0.8rem; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 12px; }

.range-inputs { display: flex; align-items: center; gap: 12px; }
.range-inputs input {
  flex: 1; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
}
.range-inputs span { color: #94a3b8; font-weight: 600; font-size: 0.85rem; }

.advanced-actions { display: flex; justify-content: flex-end; }
.btn-clear { background: none; border: none; color: #ef4444; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; }

/* CONTEÚDO E RESULTADOS */
.main-content { max-width: 1200px; margin: 0 auto; padding: 50px 20px 140px; }
.results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.count-badge { background: #1e3a8a; color: white; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; }

.export-actions { display: flex; gap: 10px; }
.btn-export { 
  display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white;
  border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700; color: #475569; cursor: pointer;
}

.cards-list { display: flex; flex-direction: column; gap: 20px; }

/* SUMMARY BAR */
.summary-bar {
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
  width: 90%; max-width: 1100px; background: #1e3a8a; border-radius: 24px;
  padding: 20px 40px; color: white; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); z-index: 1000;
}
.summary-content { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.sum-left { display: flex; align-items: center; gap: 20px; border-right: 1px solid rgba(255,255,255,0.2); padding-right: 20px; }
.circle { width: 40px; height: 40px; background: white; color: #1e3a8a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; }
.sum-values { flex: 1; display: flex; justify-content: space-around; }
.val-col strong { display: block; font-size: 1.2rem; font-weight: 800; }
.val-col strong.yellow { color: #f6d001; }
.btn-juncao { background: #f6d001; color: #1e3a8a; border: none; padding: 12px 24px; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; }

/* ANIMAÇÕES */
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 400px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; transform: translateY(-10px); }

/* --- REGRAS DE RESPONSIVIDADE (MOBILE & TABLET) --- */

@media (max-width: 1024px) {
  .hero-section {
    height: 250px;
  }
  .hero-content h1 {
    font-size: 2.2rem;
  }
  .filter-main-bar {
    padding: 15px;
    gap: 12px;
  }
  .search-input-group {
    min-width: 100%;
  }
  .advanced-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .summary-bar {
    width: 95%;
    padding: 15px 20px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 200px;
  }
  .hero-content h1 {
    font-size: 1.8rem;
  }
  .hero-content p {
    font-size: 0.9rem;
    padding: 0 10px;
  }

  /* Ajuste da Barra de Filtros no Mobile */
  .filter-wrapper {
    margin-top: -40px;
  }
  .filter-card {
    border-radius: 16px;
  }
  .filter-main-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .basic-selects {
    flex-direction: row;
    gap: 8px;
  }
  .basic-selects select {
    flex: 1;
    font-size: 0.85rem;
    padding: 12px;
  }
  .btn-toggle-advanced {
    width: 100%;
    justify-content: center;
    font-size: 0.9rem;
  }

  /* Painel de Resultados */
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .results-meta {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }
  .export-actions {
    width: 100%;
    justify-content: space-between;
  }
  .btn-export {
    flex: 1;
    justify-content: center;
  }

  /* Barra de Junção Flutuante no Mobile */
  .summary-bar {
    bottom: 15px;
    padding: 15px;
    border-radius: 16px;
  }
  .summary-content {
    flex-direction: column;
    gap: 15px;
  }
  .sum-left {
    border-right: none;
    padding-right: 0;
    width: 100%;
    justify-content: center;
  }
  .sum-values {
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 10px;
  }
  .sum-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .btn-reset, .btn-juncao {
    width: 100%;
    font-size: 0.8rem;
    padding: 12px 5px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }
  .range-inputs {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .range-inputs span {
    text-align: center;
  }
  .sum-left .label {
    display: none; /* Esconde texto longo no mobile muito pequeno */
  }
  .val-col strong {
    font-size: 1rem;
  }
}
</style>