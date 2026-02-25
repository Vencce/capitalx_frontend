<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Wallet, CheckCircle2, CloudDownload, PieChart, 
  Bell, BellRing, RefreshCw, BarChart3
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)
const syncLoading = ref(false)
const mostrarPainelNotif = ref(false)
const temNovidades = ref(false)

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
    await api.post('cartas/sincronizar/')
    await carregarDados()
    temNovidades.value = false
    mostrarPainelNotif.value = false
  } catch (error) {
    alert('Erro na sincronização')
  } finally {
    syncLoading.value = false
  }
}

// CORREÇÃO: Filtro robusto para garantir que os números apareçam
const cartasLocais = computed(() => cartas.value.filter(c => c.origem === 'LOCAL' || !c.origem))
const cartasParceiras = computed(() => cartas.value.filter(c => c.origem === 'PARCEIRO'))
const totalCredito = computed(() => cartas.value.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0))

// Cálculo para o Donut (Disponibilidade)
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
            <span>Sincronizado</span>
          </div>
          <button class="bell-btn" @click="mostrarPainelNotif = !mostrarPainelNotif">
            <component :is="temNovidades ? BellRing : Bell" :size="20" />
            <span v-if="temNovidades" class="dot"></span>
          </button>
          
          <div v-if="mostrarPainelNotif" class="dropdown-notif">
            <p>O estoque FB pode estar desatualizado.</p>
            <button @click="handleSyncRapida" class="btn-quick-sync">Sincronizar Agora</button>
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
          <div class="icon-box"><CloudDownload /></div>
          <div class="kpi-info">
            <label>Estoque API FB</label>
            <h3>{{ cartasParceiras.length }} <span>cartas</span></h3>
          </div>
        </div>
        <div class="kpi-card success">
          <div class="icon-box"><CheckCircle2 /></div>
          <div class="kpi-info">
            <label>Próprias (Local)</label>
            <h3>{{ cartasLocais.length }} <span>unidades</span></h3>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-box main-chart">
          <div class="box-header">
            <PieChart :size="18" /> <h4>Disponibilidade Geral</h4>
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

/* Header e Notificações */
.dash-header { display: flex; justify-content: space-between; align-items: flex-start; }
.brand-title h2 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
.subtitle { color: #64748b; font-size: 0.9rem; }

.actions-nav { display: flex; gap: 12px; position: relative; }
.sync-tag { 
  display: flex; align-items: center; gap: 6px; background: #f1f5f9; 
  padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #475569;
}
.bell-btn { 
  background: white; border: 1px solid #e2e8f0; padding: 8px; border-radius: 10px; 
  cursor: pointer; position: relative; color: #64748b; 
}
.bell-btn .dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; }

/* KPIs */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
.kpi-card { 
  background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;
  display: flex; align-items: center; gap: 20px; transition: 0.2s;
}
.kpi-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
.kpi-card.local { border-left: 5px solid #F6D001; }
.kpi-card.api { border-left: 5px solid #1e3a8a; }
.kpi-card.success { border-left: 5px solid #10b981; }

.icon-box { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #1e3a8a; }
.kpi-info label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
.kpi-info h3 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 4px 0 0; }
.kpi-info h3 span { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }

/* Seção de Gráficos Revisitada */
.charts-section { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }
.chart-box { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; }
.box-header { display: flex; align-items: center; gap: 10px; margin-bottom: 25px; color: #1e293b; }
.box-header h4 { margin: 0; font-weight: 700; }

.box-content.horizontal { display: flex; align-items: center; gap: 40px; justify-content: center; }
.donut-container { position: relative; width: 150px; height: 150px; flex-shrink: 0; }
.donut { width: 100%; height: 100%; border-radius: 50%; }
.hole { 
  position: absolute; top: 12%; left: 12%; width: 76%; height: 76%; 
  background: white; border-radius: 50%; display: flex; flex-direction: column; 
  align-items: center; justify-content: center;
}
.hole strong { font-size: 1.8rem; color: #1e3a8a; }
.hole small { font-size: 0.65rem; color: #94a3b8; font-weight: 700; }

.custom-legend { display: flex; flex-direction: column; gap: 12px; }
.leg-item { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #475569; }
.leg-item i { width: 12px; height: 12px; border-radius: 3px; }
.leg-item i.blue { background: #1e3a8a; }
.leg-item i.yellow { background: #F6D001; }
.leg-item i.gray { background: #cbd5e1; }
.leg-item b { margin-left: 20px; color: #1e293b; }

/* Composição de Estoque (Barras) */
.box-content.vertical { display: flex; flex-direction: column; gap: 30px; justify-content: center; height: 100%; }
.bar-group { width: 100%; }
.bar-label { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; }
.progress-track { height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 6px; transition: 1s ease-in-out; }
.progress-fill.blue { background: #1e3a8a; }
.progress-fill.yellow { background: #F6D001; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) { .charts-section { grid-template-columns: 1fr; } .box-content.horizontal { flex-direction: column; gap: 20px; } }
</style>