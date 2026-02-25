<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Wallet, CheckCircle2, CloudDownload, TrendingUp, 
  PieChart, Bell, BellRing, RefreshCw, AlertCircle
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)
const syncLoading = ref(false)
const ultimaSincronizacao = ref(null)
const mostrarPainelNotif = ref(false)
const temNovidades = ref(false)

const carregarDados = async () => {
  try {
    loading.value = true
    const response = await api.get('cartas/')
    cartas.value = response.data
    // Simula a verificação de data de atualização
    ultimaSincronizacao.value = new Date().toLocaleTimeString('pt-BR')
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
    alert(`Sincronização concluída: ${res.data.novas} novas cartas.`)
    await carregarDados()
    temNovidades.value = false
    mostrarPainelNotif.value = false
  } catch (error) {
    alert('Erro ao sincronizar via Dashboard')
  } finally {
    syncLoading.value = false
  }
}

// Correção dos bugs de contagem (Computeds garantidos)
const cartasLocais = computed(() => cartas.value.filter(c => c.origem === 'LOCAL' || !c.origem))
const cartasParceiras = computed(() => cartas.value.filter(c => c.origem === 'PARCEIRO'))
const totalCredito = computed(() => cartas.value.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0))
const totalDisponiveis = computed(() => cartas.value.filter(c => c.status === 'DISPONIVEL').length)

const chartStatus = computed(() => {
  const total = cartas.value.length || 1
  const disponivel = totalDisponiveis.value
  const reservado = cartas.value.filter(c => c.status === 'RESERVADO').length
  const vendido = cartas.value.filter(c => c.status === 'VENDIDO').length
  
  const pDisp = (disponivel / total) * 360
  const pRes = (reservado / total) * 360
  
  return {
    gradient: `#1e3a8a 0deg ${pDisp}deg, #F6D001 ${pDisp}deg ${pDisp + pRes}deg, #cbd5e1 ${pDisp + pRes}deg 360deg`,
    stats: { disponivel, reservado, vendido }
  }
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

onMounted(carregarDados)
</script>

<template>
  <AdminLayout>
    <div class="dashboard-wrapper">
      
      <header class="dash-header">
        <div>
          <h2>Visão Geral</h2>
          <p class="text-muted">Centro de controle Capital X</p>
        </div>

        <div class="notifications-area">
          <div class="sync-info">
            <RefreshCw :size="14" :class="{ 'spin': syncLoading }" />
            Última Sync: <strong>{{ ultimaSincronizacao }}</strong>
          </div>

          <div class="bell-container">
            <button class="bell-btn" @click="mostrarPainelNotif = !mostrarPainelNotif" :class="{ 'active': temNovidades }">
              <component :is="temNovidades ? BellRing : Bell" :size="22" />
              <span v-if="temNovidades" class="badge-dot"></span>
            </button>

            <div v-if="mostrarPainelNotif" class="notif-dropdown">
              <div class="notif-header">Notificações</div>
              <div class="notif-body">
                <div class="notif-item">
                  <AlertCircle :size="18" class="text-warning" />
                  <div class="notif-text">
                    <p>O estoque da API FB pode estar desatualizado.</p>
                    <button class="btn-sync-now" @click="handleSyncRapida" :disabled="syncLoading">
                      <RefreshCw :size="14" :class="{ 'spin': syncLoading }" />
                      {{ syncLoading ? 'Sincronizando...' : 'Atualizar Cartas Agora' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="grid-kpis">
        <div class="kpi-card yellow-border">
          <div class="kpi-icon yellow"><Wallet :size="24" /></div>
          <div class="kpi-content">
            <span>Volume de Crédito</span>
            <h3>{{ formatCurrency(totalCredito) }}</h3>
          </div>
        </div>

        <div class="kpi-card blue-border">
          <div class="kpi-icon blue-bg"><CloudDownload :size="24" /></div>
          <div class="kpi-content">
            <span>Estoque API FB</span>
            <h3>{{ cartasParceiras.length }} <small>cartas</small></h3>
          </div>
        </div>

        <div class="kpi-card green-border">
          <div class="kpi-icon green"><CheckCircle2 :size="24" /></div>
          <div class="kpi-content">
            <span>Próprias (Local)</span>
            <h3>{{ cartasLocais.length }} <small>unidades</small></h3>
          </div>
        </div>
      </div>

      <div class="grid-charts">
        <div class="chart-card">
          <div class="card-header"><h4>Disponibilidade</h4> <PieChart :size="18" /></div>
          <div class="chart-body">
            <div class="donut-wrapper">
              <div class="donut" :style="{ background: `conic-gradient(${chartStatus.gradient})` }">
                <div class="hole"><span>{{ cartas.length }}</span><small>TOTAL</small></div>
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
          <div class="card-header"><h4>Origem do Estoque</h4> <TrendingUp :size="18" /></div>
          <div class="bars-body">
            <div class="bar-item">
              <div class="bar-info"><span>Estoque Parceiro</span> <strong>{{ cartasParceiras.length }}</strong></div>
              <div class="bar-track"><div class="bar-fill blue" :style="{ width: (cartasParceiras.length / (cartas.length || 1) * 100) + '%' }"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-info"><span>Estoque Local</span> <strong>{{ cartasLocais.length }}</strong></div>
              <div class="bar-track"><div class="bar-fill yellow" :style="{ width: (cartasLocais.length / (cartas.length || 1) * 100) + '%' }"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Estilos Essenciais para o Sino Interativo */
.bell-container { position: relative; }
.notif-dropdown {
  position: absolute; top: 100%; right: 0; width: 300px; background: white; 
  border: 1px solid #e2e8f0; border-radius: 12px; margin-top: 10px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 100; overflow: hidden;
  animation: slideIn 0.2s ease-out;
}
.notif-header { padding: 12px 16px; background: #f8fafc; font-weight: 700; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; }
.notif-body { padding: 16px; }
.notif-item { display: flex; gap: 12px; }
.notif-text p { font-size: 0.85rem; color: #475569; margin-bottom: 10px; line-height: 1.4; }
.btn-sync-now { 
  display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center;
  background: #1e3a8a; color: white; border: none; padding: 8px; border-radius: 6px;
  font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: 0.2s;
}
.btn-sync-now:hover { background: #1e40af; }
.btn-sync-now:disabled { opacity: 0.6; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

/* Ajustes de Bordas Coloridas */
.kpi-card.yellow-border { border-bottom: 4px solid #F6D001; }
.kpi-card.blue-border { border-bottom: 4px solid #1e3a8a; }
.kpi-card.green-border { border-bottom: 4px solid #10b981; }

/* Reutilizar os outros estilos que você já tem... */
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