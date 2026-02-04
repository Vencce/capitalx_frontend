<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { Wallet, CheckCircle2, ShoppingBag, TrendingUp, ArrowRight, PieChart } from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)

// CORES EXATAS DO DESIGN
const colors = {
  yellow: '#F6D001',
  blue: '#1e3a8a',
  green: '#10b981',
  gray: '#cbd5e1'
}

const carregarDados = async () => {
  try {
    const response = await api.get('cartas/')
    cartas.value = response.data
  } catch (error) { console.error(error) } finally { loading.value = false }
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
  const g1 = `${colors.blue} 0deg ${degDisp}deg`
  current += degDisp
  const g2 = `${colors.yellow} ${current}deg ${current + degRes}deg`
  current += degRes
  const g3 = `${colors.gray} ${current}deg 360deg`
  return { gradient: `${g1}, ${g2}, ${g3}`, stats: { disponivel, reservado, vendido } }
})

const chartTipo = computed(() => {
  const imovel = cartas.value.filter(c => c.tipo === 'IMOVEL').length
  const auto = cartas.value.filter(c => c.tipo === 'AUTOMOVEL').length
  const max = Math.max(imovel, auto, 1)
  return { imovelPct: (imovel / max) * 100, autoPct: (auto / max) * 100, imovel, auto }
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
onMounted(carregarDados)
</script>

<template>
  <AdminLayout>
    <div class="dashboard-wrapper">
      
      <div class="grid-kpis">
        <div class="kpi-card highlight-border">
          <div class="kpi-icon yellow"><Wallet :size="24" /></div>
          <div class="kpi-content">
            <span>Volume de Crédito</span>
            <h3>{{ formatCurrency(totalCredito) }}</h3>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon green"><CheckCircle2 :size="24" /></div>
          <div class="kpi-content">
            <span>Disponíveis</span>
            <h3>{{ totalDisponiveis }} <small>unidades</small></h3>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon gray"><ShoppingBag :size="24" /></div>
          <div class="kpi-content">
            <span>Vendidas</span>
            <h3>{{ totalVendidas }} <small>unidades</small></h3>
          </div>
        </div>
      </div>

      <div class="grid-charts">
        <div class="chart-card">
          <div class="card-header">
            <h4>Visão Geral do Estoque</h4>
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
              <div class="legend-item"><span class="dot blue"></span> Disponível <span class="val">{{ chartStatus.stats.disponivel || 0 }}</span></div>
              <div class="legend-item"><span class="dot yellow"></span> Reservado <span class="val">{{ chartStatus.stats.reservado || 0 }}</span></div>
              <div class="legend-item"><span class="dot gray"></span> Vendido <span class="val">{{ chartStatus.stats.vendido || 0 }}</span></div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h4>Por Categoria</h4>
            <TrendingUp :size="18" class="text-muted" />
          </div>
          <div class="bars-body">
            <div class="bar-item">
              <div class="bar-info"><span>Imóveis</span> <strong>{{ chartTipo.imovel }}</strong></div>
              <div class="bar-track"><div class="bar-fill blue" :style="{ width: chartTipo.imovelPct + '%' }"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-info"><span>Automóveis</span> <strong>{{ chartTipo.auto }}</strong></div>
              <div class="bar-track"><div class="bar-fill yellow" :style="{ width: chartTipo.autoPct + '%' }"></div></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; gap: 24px; }

/* KPIs Modernos */
.grid-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.kpi-card { 
  background: white; padding: 24px; border-radius: 16px; border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 20px; transition: transform 0.2s;
}
.kpi-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.kpi-card.highlight-border { border-bottom: 4px solid var(--brand-yellow); }

.kpi-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-icon.yellow { background: #FFFBEB; color: #F6D001; }
.kpi-icon.green { background: #ecfdf5; color: #10b981; }
.kpi-icon.gray { background: #f1f5f9; color: #64748b; }

.kpi-content span { font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.kpi-content h3 { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin: 4px 0 0 0; line-height: 1; }
.kpi-content small { font-size: 0.9rem; font-weight: 500; color: #94a3b8; margin-left: 4px; }

/* Gráficos Clean */
.grid-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.chart-card { background: white; border-radius: 16px; border: 1px solid var(--border-color); padding: 24px; box-shadow: var(--shadow-sm); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.card-header h4 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }

.chart-body { display: flex; align-items: center; justify-content: space-around; }
.donut-wrapper { position: relative; width: 150px; height: 150px; }
.donut { width: 100%; height: 100%; border-radius: 50%; }
.hole { 
  position: absolute; top: 15%; left: 15%; width: 70%; height: 70%; background: white; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.hole span { font-size: 1.8rem; font-weight: 800; color: #1e3a8a; }
.hole small { font-size: 0.7rem; color: #94a3b8; font-weight: 700; }

.legend { display: flex; flex-direction: column; gap: 12px; min-width: 140px; }
.legend-item { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #475569; }
.dot { width: 10px; height: 10px; border-radius: 3px; }
.dot.blue { background: #1e3a8a; } .dot.yellow { background: #F6D001; } .dot.gray { background: #cbd5e1; }
.val { margin-left: auto; font-weight: 700; color: #1e293b; }

.bars-body { display: flex; flex-direction: column; gap: 24px; }
.bar-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem; color: #475569; }
.bar-track { height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; }
.bar-fill.blue { background: linear-gradient(90deg, #1e3a8a, #3b82f6); }
.bar-fill.yellow { background: linear-gradient(90deg, #F6D001, #fbbf24); }

@media (max-width: 1000px) { .grid-charts { grid-template-columns: 1fr; } }
</style>