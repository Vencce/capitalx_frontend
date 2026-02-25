<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Wallet, FilePlus, CloudDownload, PieChart, 
  ArrowRight, History, Bell, BellRing, RefreshCw, AlertCircle
} from 'lucide-vue-next'

const router = useRouter()
const cartas = ref([])
const loading = ref(true)
const syncLoading = ref(false)
const mostrarPainelNotif = ref(false)
const temNovidades = ref(true) 
const ultimaSincronizacao = ref(new Date().toLocaleTimeString('pt-BR'))

const carregarDados = async () => {
  try {
    loading.value = true
    const response = await api.get('cartas/')
    cartas.value = response.data
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

const ultimasCartas = computed(() => [...cartas.value].reverse().slice(0, 5))
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
          <h2>Painel de Controle</h2>
          <span class="subtitle">Bem-vindo à gestão Capital X</span>
        </div>

        <div class="header-actions">
          <div class="sync-status">
            <RefreshCw :size="14" :class="{ 'spin': syncLoading }" />
            <span>Última Sync: {{ ultimaSincronizacao }}</span>
          </div>

          <div class="bell-box">
            <button class="bell-btn" @click="mostrarPainelNotif = !mostrarPainelNotif" :class="{ 'has-news': temNovidades }">
              <component :is="temNovidades ? BellRing : Bell" :size="22" />
              <span v-if="temNovidades" class="red-dot"></span>
            </button>

            <div v-if="mostrarPainelNotif" class="notif-dropdown">
              <div class="drop-header">Ações da API</div>
              <div class="drop-body">
                <div class="notif-info">
                  <AlertCircle :size="18" class="warn-icon" />
                  <p>Atualize o estoque das administradoras parceiras.</p>
                </div>
                <button @click="handleSyncRapida" class="btn-sync-now" :disabled="syncLoading">
                  <RefreshCw :size="14" :class="{ 'spin': syncLoading }" />
                  {{ syncLoading ? 'Sincronizando...' : 'Sincronizar Agora' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="hero-section">
        <div class="hero-card">
          <div class="hero-content">
            <label>Volume Total sob Gestão</label>
            <h3>{{ formatCurrency(totalCredito) }}</h3>
          </div>
          <Wallet :size="60" class="hero-icon-bg" />
        </div>

        <div class="quick-nav">
          <button @click="router.push('/admin/cartas')" class="nav-card">
            <FilePlus :size="28" />
            <span>Nova Carta</span>
          </button>
          <button @click="router.push('/admin/estoque-parceiro')" class="nav-card blue-nav">
            <CloudDownload :size="28" />
            <span>Ver Estoque API</span>
          </button>
        </div>
      </div>

      <div class="main-grid">
        <div class="grid-card">
          <div class="card-title">
            <History :size="18" /> <h4>Adicionadas Recentemente</h4>
          </div>
          <div class="list-wrapper">
            <div v-for="carta in ultimasCartas" :key="carta.id" class="list-row">
              <div class="row-main">
                <strong>#{{ carta.codigo }}</strong>
                <small>{{ carta.administradora_detalhes?.nome || 'Adm' }}</small>
              </div>
              <div class="row-price">
                {{ formatCurrency(carta.valor_credito) }}
                <ArrowRight :size="14" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid-card">
          <div class="card-title">
            <PieChart :size="18" /> <h4>Status do Inventário</h4>
          </div>
          <div class="donut-area">
            <div class="donut-box">
              <div class="donut" :style="{ background: `conic-gradient(${chartStatus.gradient})` }">
                <div class="hole">
                  <strong>{{ cartas.length }}</strong>
                  <span>TOTAL</span>
                </div>
              </div>
            </div>
            <div class="donut-legend">
              <div class="leg"><i class="b-blue"></i> Disponível <b>{{ chartStatus.stats.disp }}</b></div>
              <div class="leg"><i class="b-yellow"></i> Reservado <b>{{ chartStatus.stats.res }}</b></div>
              <div class="leg"><i class="b-gray"></i> Vendido <b>{{ chartStatus.stats.vend }}</b></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.4s ease; }

/* HEADER */
.dash-header { display: flex; justify-content: space-between; align-items: center; }
.brand-title h2 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
.subtitle { color: #64748b; font-size: 0.9rem; font-weight: 600; }

.header-actions { display: flex; align-items: center; gap: 15px; position: relative; }
.sync-status { background: #f1f5f9; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 6px; }

.bell-box { position: relative; }
.bell-btn { background: white; border: 1px solid #e2e8f0; padding: 10px; border-radius: 12px; cursor: pointer; color: #64748b; transition: 0.2s; position: relative; }
.bell-btn.has-news { color: #f59e0b; background: #fffbeb; border-color: #fef3c7; }
.red-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; }

.notif-dropdown { position: absolute; top: 120%; right: 0; width: 280px; background: white; border: 1px solid #e2e8f0; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100; overflow: hidden; }
.drop-header { padding: 12px; background: #f8fafc; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
.drop-body { padding: 15px; }
.notif-info { display: flex; gap: 10px; margin-bottom: 15px; }
.notif-info p { font-size: 0.8rem; color: #475569; margin: 0; line-height: 1.4; }
.warn-icon { color: #f59e0b; flex-shrink: 0; }
.btn-sync-now { width: 100%; padding: 10px; border-radius: 8px; background: #1e3a8a; color: white; border: none; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

/* HERO */
.hero-section { display: grid; grid-template-columns: 1fr 350px; gap: 20px; }
.hero-card { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 40px; border-radius: 24px; color: white; position: relative; overflow: hidden; box-shadow: 0 10px 20px rgba(30, 58, 138, 0.15); }
.hero-content label { font-size: 0.85rem; font-weight: 600; opacity: 0.8; text-transform: uppercase; }
.hero-content h3 { font-size: 2.6rem; font-weight: 800; margin: 8px 0 0; }
.hero-icon-bg { position: absolute; right: -10px; bottom: -10px; opacity: 0.1; transform: rotate(-15deg); }

.quick-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.nav-card { background: white; border: 1px solid #e2e8f0; border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.3s; font-weight: 700; color: #1e293b; }
.nav-card svg { color: #F6D001; }
.nav-card.blue-nav svg { color: #1e3a8a; }
.nav-card:hover { transform: translateY(-5px); border-color: #F6D001; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

/* GRID */
.main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.grid-card { background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 25px; }
.card-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #1e293b; }
.card-title h4 { margin: 0; font-weight: 800; }

.list-wrapper { display: flex; flex-direction: column; gap: 10px; }
.list-row { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: #f8fafc; border-radius: 15px; transition: 0.2s; }
.list-row:hover { background: #f1f5f9; }
.row-main { display: flex; flex-direction: column; }
.row-main strong { font-size: 0.9rem; color: #1e3a8a; }
.row-main small { font-size: 0.75rem; color: #64748b; font-weight: 600; }
.row-price { font-weight: 800; color: #1e293b; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; }

.donut-area { display: flex; align-items: center; justify-content: space-around; height: 100%; }
.donut-box { position: relative; width: 150px; height: 150px; }
.donut { width: 100%; height: 100%; border-radius: 50%; }
.hole { position: absolute; top: 12%; left: 12%; width: 76%; height: 76%; background: white; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.hole strong { font-size: 2rem; color: #1e3a8a; }
.hole span { font-size: 0.6rem; font-weight: 800; color: #94a3b8; }

.donut-legend { display: flex; flex-direction: column; gap: 12px; }
.leg { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 700; color: #475569; }
.leg i { width: 12px; height: 12px; border-radius: 4px; }
.b-blue { background: #1e3a8a; }
.b-yellow { background: #F6D001; }
.b-gray { background: #cbd5e1; }
.leg b { margin-left: 15px; color: #1e293b; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1024px) { .hero-section, .main-grid { grid-template-columns: 1fr; } .donut-area { flex-direction: column; gap: 20px; } }
</style>