<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Wallet, CheckCircle2, ShoppingBag, TrendingUp, 
  PieChart, Bell, BellRing, CloudDownload, RefreshCw
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)
const ultimaSincronizacao = ref(null)
const temNovidades = ref(false)

const colors = {
  yellow: '#F6D001',
  blue: '#1e3a8a',
  green: '#10b981',
  gray: '#cbd5e1',
  orange: '#f59e0b'
}

const carregarDados = async () => {
  try {
    const response = await api.get('cartas/')
    cartas.value = response.data
    // Simulação de verificação de timestamp de sincronização
    ultimaSincronizacao.value = new Date().toLocaleTimeString('pt-BR')
    temNovidades.value = true // Ativa o sino ao carregar
  } catch (error) { 
    console.error(error) 
  } finally { 
    loading.value = false 
  }
}

// Filtros de Origem para os novos KPIs
const cartasLocais = computed(() => cartas.value.filter(c => c.origem === 'LOCAL'))
const cartasParceiras = computed(() => cartas.value.filter(c => c.origem === 'PARCEIRO'))

const totalCredito = computed(() => cartas.value.reduce((acc, c) => acc + parseFloat(c.valor_credito), 0))
const totalDisponiveis = computed(() => cartas.value.filter(c => c.status === 'DISPONIVEL').length)

const chartStatus = computed(() => {
  const total = cartas.value.length
  if (total === 0) return { gradient: `${colors.gray} 0deg 360deg`, stats: {} }
  const disponivel = totalDisponiveis.value
  const reservado = cartas.value.filter(c => c.status === 'RESERVADO').length
  const degDisp = (disponivel / total) * 360
  const degRes = (reservado / total) * 360
  return { 
    gradient: `${colors.blue} 0deg ${degDisp}deg, ${colors.yellow} ${degDisp}deg ${degDisp + degRes}deg, ${colors.gray} ${degDisp + degRes}deg 360deg`,
    stats: { disponivel, reservado, vendido: total - disponivel - reservado } 
  }
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

const limparNotificacao = () => {
  temNovidades.value = false
}

onMounted(carregarDados)
</script>

<template>
  <AdminLayout>
    <div class="dashboard-wrapper">
      
      <header class="dash-header">
        <div>
          <h2>Visão Geral</h2>
          <p class="text-muted">Bem-vindo ao centro de controle Capital X.</p>
        </div>
        <div class="notifications-area">
          <div class="sync-info">
            <RefreshCw :size="14" />
            Última Sincronização: <strong>{{ ultimaSincronizacao || 'Carregando...' }}</strong>
          </div>
          <button class="bell-btn" @click="limparNotificacao" :class="{ 'has-news': temNovidades }">
            <component :is="temNovidades ? BellRing : Bell" :size="22" />
            <span v-if="temNovidades" class="badge-dot"></span>
          </button>
        </div>
      </header>

      <div class="grid-kpis">
        <div class="kpi-card highlight-yellow">
          <div class="kpi-icon yellow"><Wallet :size="24" /></div>
          <div class="kpi-content">
            <span>Volume de Crédito</span>
            <h3>{{ formatCurrency(totalCredito) }}</h3>
          </div>
        </div>

        <div class="kpi-card highlight-blue">
          <div class="kpi-icon blue-bg"><CloudDownload :size="24" /></div>
          <div class="kpi-content">
            <span>Estoque API FB</span>
            <h3>{{ cartasParceiras.length }} <small>cartas</small></h3>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon green"><CheckCircle2 :size="24" /></div>
          <div class="kpi-content">
            <span>Próprias (Local)</span>
            <h3>{{ cartasLocais.length }} <small>unidades</small></h3>
          </div>
        </div>
      </div>

      <div class="grid-charts">
        <div class="chart-card">
          <div class="card-header">
            <h4>Disponibilidade Geral</h4>
            <PieChart :size="18" class="text-muted" />
          </div>
          <div class="chart-body">
            <div class="donut-wrapper">
              <div class="donut" :style="{ background: `conic-gradient(${chartStatus.gradient})` }">
                <div class="hole">
                  <span>{{ cartas.length }}</span>
                  <small>TOTAL</small>
                </div>
              </div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="dot blue"></span> Disponível <span class="val">{{ chartStatus.stats.disponivel }}</span></div>
              <div class="legend-item"><span class="dot yellow"></span> Reservado <span class="val">{{ chartStatus.stats.reservado }}</span></div>
              <div class="legend-item"><span class="dot gray"></span> Vendido <span class="val">{{ chartStatus.stats.vendido }}</span></div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h4>Origem do Estoque</h4>
            <TrendingUp :size="18" class="text-muted" />
          </div>
          <div class="bars-body">
            <div class="bar-item">
              <div class="bar-info"><span>Estoque Parceiro</span> <strong>{{ cartasParceiras.length }}</strong></div>
              <div class="bar-track"><div class="bar-fill blue" :style="{ width: (cartasParceiras.length / cartas.length * 100) + '%' }"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-info"><span>Estoque Local</span> <strong>{{ cartasLocais.length }}</strong></div>
              <div class="bar-track"><div class="bar-fill yellow" :style="{ width: (cartasLocais.length / cartas.length * 100) + '%' }"></div></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.4s ease-out; }

.dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.dash-header h2 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }

.notifications-area { display: flex; align-items: center; gap: 20px; }
.sync-info { font-size: 0.75rem; color: #64748b; background: white; padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 6px; }

.bell-btn { position: relative; background: white; border: 1px solid var(--border-color); padding: 10px; border-radius: 12px; cursor: pointer; color: #64748b; transition: all 0.2s; }
.bell-btn:hover { background: #f8fafc; color: var(--brand-yellow); border-color: var(--brand-yellow); }
.bell-btn.has-news { color: #f59e0b; border-color: #fef3c7; background: #fffbeb; animation: pulse 2s infinite; }

.badge-dot { position: absolute; top: 8px; right: 8px; width: 10px; height: 10px; background: #ef4444; border: 2px solid white; border-radius: 50%; }

.grid-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.kpi-card { background: white; padding: 24px; border-radius: 16px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 20px; transition: transform 0.2s; }
.kpi-card:hover { transform: translateY(-3px); }
.kpi-card.highlight-yellow { border-bottom: 4px solid var(--brand-yellow); }
.kpi-card.highlight-blue { border-bottom: 4px solid #1e3a8a; }

.kpi-icon.blue-bg { background: #e0f2fe; color: #1e3a8a; }
.kpi-icon.yellow { background: #FFFBEB; color: #F6D001; }
.kpi-icon.green { background: #ecfdf5; color: #10b981; }

.kpi-content span { font-size: 0.85rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
.kpi-content h3 { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin: 4px 0 0 0; }

.grid-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.chart-card { background: white; border-radius: 16px; border: 1px solid var(--border-color); padding: 24px; }

.donut-wrapper { position: relative; width: 160px; height: 160px; }
.donut { width: 100%; height: 100%; border-radius: 50%; }
.hole { position: absolute; top: 15%; left: 15%; width: 70%; height: 70%; background: white; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.hole span { font-size: 2rem; font-weight: 800; color: #1e3a8a; }

.bar-track { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
.bar-fill.blue { background: #1e3a8a; }
.bar-fill.yellow { background: #F6D001; }

@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); } 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1100px) { .grid-charts { grid-template-columns: 1fr; } }
</style>