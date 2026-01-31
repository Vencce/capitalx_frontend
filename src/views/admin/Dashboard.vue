<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'

const cartas = ref([])
const loading = ref(true)

// Cores para o Gráfico de Rosca (têm que bater com o CSS)
const colors = {
  green: '#10b981',  // Disponível
  orange: '#f59e0b', // Reservado
  red: '#ef4444',    // Vendido
  gray: '#e2e8f0'    // Vazio
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

// --- KPIs ---
const totalCredito = computed(() => cartas.value.reduce((acc, c) => acc + parseFloat(c.valor_credito), 0))
const totalDisponiveis = computed(() => cartas.value.filter(c => c.status === 'DISPONIVEL').length)
const totalVendidas = computed(() => cartas.value.filter(c => c.status === 'VENDIDO').length)

// --- Lógica do Gráfico de Rosca (Donut) ---
const chartStatus = computed(() => {
  const total = cartas.value.length
  if (total === 0) return { gradient: `${colors.gray} 0deg 360deg`, stats: {} }

  const disponivel = cartas.value.filter(c => c.status === 'DISPONIVEL').length
  const reservado = cartas.value.filter(c => c.status === 'RESERVADO').length
  const vendido = cartas.value.filter(c => c.status === 'VENDIDO').length

  // Calcula os graus de cada fatia (Total = 360 graus)
  const degDisp = (disponivel / total) * 360
  const degRes = (reservado / total) * 360
  const degVend = (vendido / total) * 360

  let current = 0
  
  // Monta a string do CSS conic-gradient
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

// --- Lógica do Gráfico de Barras ---
const chartTipo = computed(() => {
  const imovel = cartas.value.filter(c => c.tipo === 'IMOVEL').length
  const auto = cartas.value.filter(c => c.tipo === 'AUTOMOVEL').length
  
  // Pega o maior valor para definir a escala de 100%
  const max = Math.max(imovel, auto, 1)

  return {
    imovelPct: (imovel / max) * 100,
    autoPct: (auto / max) * 100,
    imovel,
    auto
  }
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

onMounted(() => {
  carregarDados()
})
</script>

<template>
  <AdminLayout>
    <div class="dashboard-wrapper">
      
      <div class="grid-kpis">
        <div class="card-clean kpi-box">
          <div class="kpi-icon bg-blue-soft">💰</div>
          <div>
            <span class="kpi-label">Volume Total</span>
            <h3 class="kpi-value">{{ formatCurrency(totalCredito) }}</h3>
          </div>
        </div>

        <div class="card-clean kpi-box">
          <div class="kpi-icon bg-green-soft">✅</div>
          <div>
            <span class="kpi-label">Disponíveis</span>
            <h3 class="kpi-value">{{ totalDisponiveis }} cartas</h3>
          </div>
        </div>

        <div class="card-clean kpi-box">
          <div class="kpi-icon bg-orange-soft">🚀</div>
          <div>
            <span class="kpi-label">Vendidas</span>
            <h3 class="kpi-value">{{ totalVendidas }} cartas</h3>
          </div>
        </div>
      </div>

      <div class="grid-charts">
        
        <div class="card-clean chart-box">
          <h4 class="chart-title">Status do Estoque</h4>
          <div class="chart-content">
            <div class="donut" :style="{ background: `conic-gradient(${chartStatus.gradient})` }">
              <div class="hole">
                <span>{{ cartas.length }}</span>
                <small>Total</small>
              </div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="dot green"></span> Disp. ({{ chartStatus.stats.disponivel || 0 }})</div>
              <div class="legend-item"><span class="dot orange"></span> Res. ({{ chartStatus.stats.reservado || 0 }})</div>
              <div class="legend-item"><span class="dot red"></span> Vend. ({{ chartStatus.stats.vendido || 0 }})</div>
            </div>
          </div>
        </div>

        <div class="card-clean chart-box">
          <h4 class="chart-title">Por Categoria</h4>
          <div class="bars-container">
            <div class="bar-group">
              <div class="bar-header">
                <span>Imóveis</span>
                <span class="font-bold">{{ chartTipo.imovel }}</span>
              </div>
              <div class="track">
                <div class="fill blue" :style="{ width: chartTipo.imovelPct + '%' }"></div>
              </div>
            </div>
            
            <div class="bar-group">
              <div class="bar-header">
                <span>Automóveis</span>
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
          <h3 class="section-title">Adições Recentes</h3>
          <RouterLink to="/admin/cartas" class="link-soft">Ver todas &rarr;</RouterLink>
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
              <td colspan="4" style="text-align: center; padding: 20px; color: #999;">Nenhum dado disponível.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; gap: 32px; }

/* Grid de KPIs */
.grid-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.kpi-box {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.kpi-icon {
  width: 56px; height: 56px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
}
.bg-blue-soft { background: #eff6ff; }
.bg-green-soft { background: #f0fdf4; }
.bg-orange-soft { background: #fff7ed; }

.kpi-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
.kpi-value { font-size: 1.5rem; font-weight: 700; color: var(--primary); margin: 4px 0 0 0; }

/* Grid de Gráficos */
.grid-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-box { padding: 24px; }
.chart-title { font-size: 1rem; color: var(--primary); margin-bottom: 24px; font-weight: 700; }

/* Donut */
.chart-content { display: flex; align-items: center; justify-content: space-around; gap: 20px; }
.donut { width: 140px; height: 140px; border-radius: 50%; position: relative; }
.hole {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 100px; height: 100px; background: white; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-weight: bold; color: var(--primary); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.hole small { font-size: 0.7rem; color: var(--text-muted); font-weight: normal; }

.legend { display: flex; flex-direction: column; gap: 10px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-main); font-weight: 500; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.green { background: #10b981; }
.dot.orange { background: #f59e0b; }
.dot.red { background: #ef4444; }

/* Barras */
.bars-container { display: flex; flex-direction: column; gap: 24px; padding: 10px 0; }
.bar-group { width: 100%; }
.bar-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-main); }
.track { width: 100%; height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
.fill { height: 100%; border-radius: 5px; transition: width 0.5s ease-out; }
.fill.blue { background: #3b82f6; }
.fill.yellow { background: #f59e0b; }

/* Tabela */
.table-section { padding: 32px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.section-title { font-size: 1.1rem; font-weight: 700; color: var(--primary); }
.link-soft { color: var(--accent); text-decoration: none; font-weight: 600; font-size: 0.9rem; }

.soft-table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
.soft-table th { text-align: left; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 16px; }
.soft-table td { background: #f8fafc; padding: 16px; transition: var(--transition); }
.soft-table tr td:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
.soft-table tr td:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
.soft-table tr:hover td { background: #f1f5f9; }

.font-mono { font-family: monospace; font-weight: 600; }
.font-bold { font-weight: 700; }
.text-muted { color: var(--text-muted); }
.badge-mini { background: white; border: 1px solid var(--border-light); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; color: var(--text-muted); }

.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
.status-badge.disponivel { background: var(--status-success); color: var(--status-success-text); }
.status-badge.reservado { background: var(--status-warning); color: var(--status-warning-text); }
.status-badge.vendido { background: var(--status-danger); color: var(--status-danger-text); }

@media (max-width: 900px) {
  .grid-charts { grid-template-columns: 1fr; }
}
</style>