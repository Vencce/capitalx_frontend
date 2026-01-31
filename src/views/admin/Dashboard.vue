<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Wallet, 
  CheckCircle2, 
  ShoppingBag, 
  TrendingUp, 
  ArrowRight
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)

const colors = {
  green: '#10b981',  
  orange: '#f59e0b', 
  red: '#ef4444',    
  gray: '#e2e8f0'    
}

const carregarDados = async () => {
  try {
    const response = await api.get('cartas/')
    cartas.value = response.data
  } catch (error) {
    console.error("Erro ao carregar dashboard", error)
  } finally {
    loading.value = false
  }
}

const totalCredito = computed(() => cartas.value.reduce((acc, c) => acc + parseFloat(c.valor_credito), 0))
const totalDisponiveis = computed(() => cartas.value.filter(c => c.status === 'DISPONIVEL').length)
const totalVendidas = computed(() => cartas.value.filter(c => c.status === 'VENDIDO').length)

const chartStatus = computed(() => {
  const total = cartas.value.length
  if (total === 0) return { gradient: `${colors.gray} 0deg 360deg`, stats: {} }

  const disponivel = cartas.value.filter(c => c.status === 'DISPONIVEL').length
  const reservado = cartas.value.filter(c => c.status === 'RESERVADO').length
  const vendido = cartas.value.filter(c => c.status === 'VENDIDO').length

  const degDisp = (disponivel / total) * 360
  const degRes = (reservado / total) * 360

  let current = 0
  const g1 = `${colors.green} 0deg ${degDisp}deg`
  current += degDisp
  const g2 = `${colors.orange} ${current}deg ${current + degRes}deg`
  current += degRes
  const g3 = `${colors.red} ${current}deg 360deg`

  return {
    gradient: `${g1}, ${g2}, ${g3}`,
    stats: { disponivel, reservado, vendido }
  }
})

const chartTipo = computed(() => {
  const imovel = cartas.value.filter(c => c.tipo === 'IMOVEL').length
  const auto = cartas.value.filter(c => c.tipo === 'AUTOMOVEL').length
  const max = Math.max(imovel, auto, 1)

  return {
    imovelPct: (imovel / max) * 100,
    autoPct: (auto / max) * 100,
    imovel,
    auto
  }
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

onMounted(carregarDados)
</script>

<template>
  <AdminLayout>
    <div class="dashboard-wrapper">
      
      <div class="grid-kpis">
        <div class="card-clean kpi-box">
          <div class="kpi-icon bg-blue-soft">
            <Wallet :size="24" class="text-blue" />
          </div>
          <div>
            <span class="kpi-label">Volume de Crédito</span>
            <h3 class="kpi-value">{{ formatCurrency(totalCredito) }}</h3>
          </div>
        </div>

        <div class="card-clean kpi-box">
          <div class="kpi-icon bg-green-soft">
            <CheckCircle2 :size="24" class="text-green" />
          </div>
          <div>
            <span class="kpi-label">Disponíveis</span>
            <h3 class="kpi-value">{{ totalDisponiveis }} <small>unidades</small></h3>
          </div>
        </div>

        <div class="card-clean kpi-box">
          <div class="kpi-icon bg-orange-soft">
            <ShoppingBag :size="24" class="text-orange" />
          </div>
          <div>
            <span class="kpi-label">Vendidas</span>
            <h3 class="kpi-value">{{ totalVendidas }} <small>unidades</small></h3>
          </div>
        </div>
      </div>

      <div class="grid-charts">
        <div class="card-clean chart-box">
          <div class="chart-header">
            <h4 class="chart-title">Status do Estoque</h4>
            <TrendingUp :size="18" color="#94a3b8" />
          </div>
          <div class="chart-content">
            <div class="donut" :style="{ background: `conic-gradient(${chartStatus.gradient})` }">
              <div class="hole">
                <span>{{ cartas.length }}</span>
                <small>Total</small>
              </div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="dot green"></span> 
                <span class="legend-text">Disponível</span>
                <span class="legend-val">{{ chartStatus.stats.disponivel || 0 }}</span>
              </div>
              <div class="legend-item">
                <span class="dot orange"></span> 
                <span class="legend-text">Reservado</span>
                <span class="legend-val">{{ chartStatus.stats.reservado || 0 }}</span>
              </div>
              <div class="legend-item">
                <span class="dot red"></span> 
                <span class="legend-text">Vendido</span>
                <span class="legend-val">{{ chartStatus.stats.vendido || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-clean chart-box">
          <div class="chart-header">
            <h4 class="chart-title">Distribuição por Categoria</h4>
          </div>
          <div class="bars-container">
            <div class="bar-group">
              <div class="bar-header">
                <span class="bar-label">Imóveis</span>
                <span class="font-bold">{{ chartTipo.imovel }}</span>
              </div>
              <div class="track">
                <div class="fill blue" :style="{ width: chartTipo.imovelPct + '%' }"></div>
              </div>
            </div>
            
            <div class="bar-group">
              <div class="bar-header">
                <span class="bar-label">Automóveis</span>
                <span class="font-bold">{{ chartTipo.auto }}</span>
              </div>
              <div class="track">
                <div class="fill yellow" :style="{ width: chartTipo.autoPct + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-clean table-section">
        <div class="section-header">
          <h3 class="section-title">Últimas Atualizações</h3>
          <RouterLink to="/admin/cartas" class="link-action">
            Gerenciar todas
            <ArrowRight :size="16" />
          </RouterLink>
        </div>
        
        <table class="soft-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Crédito</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in cartas.slice(0, 5)" :key="carta.id">
              <td class="font-mono text-muted">#{{ carta.codigo }}</td>
              <td>
                 <span class="badge-mini">{{ carta.tipo }}</span>
              </td>
              <td class="font-bold">{{ formatCurrency(carta.valor_credito) }}</td>
              <td>
                <span class="status-badge" :class="carta.status.toLowerCase()">
                  {{ carta.status }}
                </span>
              </td>
            </tr>
             <tr v-if="cartas.length === 0">
              <td colspan="4" class="empty-msg">Nenhuma movimentação recente.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; gap: 32px; }

.grid-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.card-clean { background: white; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.kpi-box { padding: 32px; display: flex; align-items: center; gap: 24px; }

.kpi-icon { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
.bg-blue-soft { background: #eff6ff; }
.text-blue { color: #2563eb; }
.bg-green-soft { background: #ecfdf5; }
.text-green { color: #059669; }
.bg-orange-soft { background: #fff7ed; }
.text-orange { color: #d97706; }

.kpi-label { font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; }
.kpi-value { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin: 4px 0 0 0; }
.kpi-value small { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }

.grid-charts { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
.chart-box { padding: 32px; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.chart-title { font-size: 1.1rem; color: #1e293b; font-weight: 700; margin: 0; }

.chart-content { display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.donut { width: 160px; height: 160px; border-radius: 50%; position: relative; transition: transform 0.3s; }
.donut:hover { transform: scale(1.02); }
.hole { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 115px; height: 115px; background: white; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 4px 10px rgba(0,0,0,0.03); }
.hole span { font-size: 2rem; font-weight: 800; color: #1e293b; }
.hole small { font-size: 0.8rem; color: #64748b; font-weight: 600; }

.legend { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 12px; }
.legend-text { flex: 1; font-size: 0.9rem; color: #475569; font-weight: 500; }
.legend-val { font-weight: 700; color: #1e293b; }
.dot { width: 10px; height: 10px; border-radius: 3px; }
.dot.green { background: #10b981; }
.dot.orange { background: #f59e0b; }
.dot.red { background: #ef4444; }

.bars-container { display: flex; flex-direction: column; gap: 28px; }
.bar-label { font-size: 0.95rem; font-weight: 500; color: #475569; }
.track { width: 100%; height: 12px; background: #f1f5f9; border-radius: 20px; overflow: hidden; margin-top: 8px; }
.fill { height: 100%; border-radius: 20px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
.fill.blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.fill.yellow { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

.table-section { padding: 32px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.section-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; }
.link-action { display: flex; align-items: center; gap: 6px; color: #2563eb; text-decoration: none; font-weight: 700; font-size: 0.9rem; padding: 8px 16px; background: #eff6ff; border-radius: 8px; transition: all 0.2s; }
.link-action:hover { background: #dbeafe; gap: 10px; }

.soft-table { width: 100%; border-collapse: collapse; }
.soft-table th { text-align: left; color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
.soft-table td { padding: 20px 16px; border-bottom: 1px solid #f8fafc; color: #334155; }
.soft-table tr:last-child td { border-bottom: none; }

.status-badge { padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.status-badge.disponivel { background: #ecfdf5; color: #065f46; }
.status-badge.reservado { background: #fffbeb; color: #92400e; }
.status-badge.vendido { background: #fef2f2; color: #991b1b; }

.empty-msg { text-align: center; padding: 40px !important; color: #94a3b8; }

@media (max-width: 1100px) {
  .grid-charts { grid-template-columns: 1fr; }
}
</style>