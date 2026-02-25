<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Wallet, CheckCircle2, CloudDownload, PieChart, 
  Bell, BellRing, RefreshCw, BarChart3, AlertCircle
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)
const syncLoading = ref(false)
const mostrarPainelNotif = ref(false)
const temNovidades = ref(false)
const ultimaSincronizacao = ref('08:54:39')

const carregarDados = async () => {
  try {
    loading.value = true
    const response = await api.get('cartas/')
    cartas.value = response.data
    temNovidades.value = true
  } catch (error) { 
    console.error(error) 
  } finally { 
    loading.value = false 
  }
}

const handleSyncRapida = async () => {
  syncLoading.value = true
  try {
    const res = await api.post('cartas/sincronizar/')
    ultimaSincronizacao.value = new Date().toLocaleTimeString('pt-BR')
    await carregarDados()
    temNovidades.value = false
    mostrarPainelNotif.value = false
    alert('Sincronização realizada com sucesso!')
  } catch (error) {
    alert('Erro ao sincronizar')
  } finally {
    syncLoading.value = false
  }
}

// LÓGICA DE FILTRO REFORÇADA (Converte para Maiúsculas para evitar erro de leitura)
const cartasLocais = computed(() => {
  return cartas.value.filter(c => {
    const orig = (c.origem || 'LOCAL').toUpperCase().trim()
    return orig === 'LOCAL'
  })
})

const cartasParceiras = computed(() => {
  return cartas.value.filter(c => {
    const orig = (c.origem || '').toUpperCase().trim()
    return orig === 'PARCEIRO'
  })
})

const totalCredito = computed(() => cartas.value.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0))

const chartStatus = computed(() => {
  const total = cartas.value.length || 1
  const disp = cartas.value.filter(c => c.status === 'DISPONIVEL').length
  const res = cartas.value.filter(c => c.status === 'RESERVADO').length
  const vend = cartas.value.filter(c => c.status === 'VENDIDO').length
  
  const pDisp = (disp / total) * 360
  const pRes = (res / total) * 360
  
  return {
    gradient: `#1e3a8a 0deg ${pDisp}deg, #F6D001 ${pDisp}deg ${pDisp + pRes}deg, #cbd5e1 ${pDisp + pRes}deg 360deg`,
    stats: { disp, res, vend }
  }
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
onMounted(carregarDados)
</script>

<template>
  <AdminLayout>
    <div class="dashboard-wrapper">
      
      <header class="dash-header">
        <div class="brand-title">
          <h2>Visão Geral</h2>
          <span class="subtitle">Centro de controle Capital X</span>
        </div>

        <div class="actions-nav">
          <div class="sync-tag">
            <RefreshCw :size="14" :class="{ 'spin': syncLoading }" />
            <span>Sincronizado: {{ ultimaSincronizacao }}</span>
          </div>

          <div class="bell-wrapper">
            <button class="bell-btn" @click="mostrarPainelNotif = !mostrarPainelNotif" :class="{ 'active': temNovidades }">
              <component :is="temNovidades ? BellRing : Bell" :size="20" />
              <span v-if="temNovidades" class="dot"></span>
            </button>
            
            <div v-if="mostrarPainelNotif" class="dropdown-notif">
              <div class="dropdown-header">Notificações</div>
              <div class="dropdown-body">
                <div class="notif-content">
                  <AlertCircle :size="18" class="text-orange" />
                  <p>O estoque da API FB pode estar desatualizado.</p>
                </div>
                <button @click="handleSyncRapida" class="btn-sync-action" :disabled="syncLoading">
                  <RefreshCw :size="14" :class="{ 'spin': syncLoading }" />
                  {{ syncLoading ? 'Atualizando...' : 'Atualizar API Agora' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="kpi-grid">
        <div class="kpi-card local">
          <div class="icon-box"><Wallet /></div>
          <div class="kpi-info">
            <label>Volume de Crédito</label>
            <h3>{{ formatCurrency(totalCredito) }}</h3>
          </div>
        </div>
        <div class="kpi-card api">
          <div class="icon-box blue"><CloudDownload /></div>
          <div class="kpi-info">
            <label>Estoque API FB</label>
            <h3>{{ cartasParceiras.length }} <span>cartas</span></h3>
          </div>
        </div>
        <div class="kpi-card success">
          <div class="icon-box green"><CheckCircle2 /></div>
          <div class="kpi-info">
            <label>Próprias (Local)</label>
            <h3>{{ cartasLocais.length }} <span>unidades</span></h3>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-box main-chart">
          <div class="box-header">
            <PieChart :size="18" /> <h4>Disponibilidade</h4>
          </div>
          <div class="box-content horizontal">
            <div class="donut-container">
              <div class="donut" :style="{ background: `conic-gradient(${chartStatus.gradient})` }">
                <div class="hole">
                  <strong>{{ cartas.length }}</strong>
                  <small>TOTAL</small>
                </div>
              </div>
            </div>
            <div class="custom-legend">
              <div class="leg-item"><i class="blue"></i> Disponível <b>{{ chartStatus.stats.disp }}</b></div>
              <div class="leg-item"><i class="yellow"></i> Reservado <b>{{ chartStatus.stats.res }}</b></div>
              <div class="leg-item"><i class="gray"></i> Vendido <b>{{ chartStatus.stats.vend }}</b></div>
            </div>
          </div>
        </div>

        <div class="chart-box">
          <div class="box-header">
            <BarChart3 :size="18" /> <h4>Composição do Estoque</h4>
          </div>
          <div class="box-content vertical">
            <div class="bar-group">
              <div class="bar-label"><span>Parceiro (FB)</span> <b>{{ cartasParceiras.length }}</b></div>
              <div class="progress-track">
                <div class="progress-fill blue" :style="{ width: (cartasParceiras.length / (cartas.length || 1) * 100) + '%' }"></div>
              </div>
            </div>
            <div class="bar-group">
              <div class="bar-label"><span>Próprio (Local)</span> <b>{{ cartasLocais.length }}</b></div>
              <div class="progress-track">
                <div class="progress-fill yellow" :style="{ width: (cartasLocais.length / (cartas.length || 1) * 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; gap: 30px; }

/* HEADER */
.dash-header { display: flex; justify-content: space-between; align-items: flex-start; }
.brand-title h2 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
.subtitle { color: #64748b; font-size: 0.9rem; font-weight: 600; }

.actions-nav { display: flex; gap: 12px; align-items: center; }
.sync-tag { display: flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #475569; }

/* SINO E DROPDOWN */
.bell-wrapper { position: relative; }
.bell-btn { background: white; border: 1px solid #e2e8f0; padding: 8px; border-radius: 10px; cursor: pointer; color: #64748b; transition: 0.2s; }
.bell-btn.active { color: #f59e0b; background: #fffbeb; border-color: #fef3c7; }
.bell-btn .dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; }

.dropdown-notif { 
  position: absolute; top: calc(100% + 10px); right: 0; width: 280px; 
  background: white; border: 1px solid #e2e8f0; border-radius: 12px; 
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); z-index: 100; overflow: hidden;
  animation: slideIn 0.2s ease-out;
}
.dropdown-header { padding: 12px; background: #f8fafc; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #e2e8f0; }
.dropdown-body { padding: 16px; }
.notif-content { display: flex; gap: 10px; margin-bottom: 15px; }
.notif-content p { font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.4; }
.text-orange { color: #f59e0b; }

.btn-sync-action { 
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
  background: #1e3a8a; color: white; border: none; padding: 10px; border-radius: 8px;
  font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s;
}
.btn-sync-action:hover { background: #1e40af; }

/* KPIS */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
.kpi-card { background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 20px; transition: 0.2s; }
.kpi-card.local { border-left: 5px solid #F6D001; }
.kpi-card.api { border-left: 5px solid #1e3a8a; }
.kpi-card.success { border-left: 5px solid #10b981; }

.icon-box { width: 48px; height: 48px; border-radius: 12px; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: #1e293b; }
.icon-box.blue { color: #1e3a8a; background: #eff6ff; }
.icon-box.green { color: #10b981; background: #f0fdf4; }

.kpi-info label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
.kpi-info h3 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 4px 0 0; }
.kpi-info h3 span { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }

/* GRÁFICOS */
.charts-section { display: grid; grid-template-columns: 1.1fr 1fr; gap: 20px; }
.chart-box { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; }
.box-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #1e293b; }
.box-header h4 { margin: 0; font-weight: 800; font-size: 1rem; }

.box-content.horizontal { display: flex; align-items: center; justify-content: center; gap: 30px; }
.donut-container { position: relative; width: 140px; height: 140px; }
.donut { width: 100%; height: 100%; border-radius: 50%; }
.hole { 
  position: absolute; top: 12%; left: 12%; width: 76%; height: 76%; 
  background: white; border-radius: 50%; display: flex; flex-direction: column; 
  align-items: center; justify-content: center; box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
}
.hole strong { font-size: 1.8rem; color: #1e3a8a; }
.hole small { font-size: 0.65rem; color: #94a3b8; font-weight: 800; }

.custom-legend { display: flex; flex-direction: column; gap: 10px; }
.leg-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #475569; }
.leg-item i { width: 10px; height: 10px; border-radius: 3px; }
.leg-item i.blue { background: #1e3a8a; }
.leg-item i.yellow { background: #F6D001; }
.leg-item i.gray { background: #cbd5e1; }
.leg-item b { margin-left: auto; color: #1e293b; padding-left: 15px; }

.box-content.vertical { display: flex; flex-direction: column; gap: 20px; padding-top: 10px; }
.bar-group { width: 100%; }
.bar-label { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem; font-weight: 700; }
.progress-track { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 5px; transition: 1s cubic-bezier(0.4, 0, 0.2, 1); }
.progress-fill.blue { background: #1e3a8a; }
.progress-fill.yellow { background: #F6D001; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1024px) { 
  .charts-section { grid-template-columns: 1fr; } 
  .box-content.horizontal { flex-direction: column; gap: 20px; }
}
</style>