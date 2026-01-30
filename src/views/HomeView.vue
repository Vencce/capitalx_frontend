<script setup>
import { ref, onMounted, computed } from 'vue'
// Ajuste dos caminhos: subimos um nível (../) para achar as pastas services e components
import api from '../services/api'
import CartaCard from '../components/CartaCard.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const cartas = ref([])
const carregando = ref(true)

// Estados dos Filtros
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

const cartasFiltradas = computed(() => {
  return cartas.value.filter(c => {
    // Filtro por Tipo
    if (filtroTipo.value && c.tipo !== filtroTipo.value) return false
    
    // Filtro por Administradora (texto parcial)
    if (filtroAdmin.value && !c.administradora.toLowerCase().includes(filtroAdmin.value.toLowerCase())) return false
    
    // Filtro por Crédito (Mínimo e Máximo)
    const valorCredito = parseFloat(c.valor_credito)
    if (creditoMin.value && valorCredito < parseFloat(creditoMin.value)) return false
    if (creditoMax.value && valorCredito > parseFloat(creditoMax.value)) return false

    // Filtro por Entrada (Mínimo e Máximo)
    const valorEntrada = parseFloat(c.valor_entrada)
    if (entradaMin.value && valorEntrada < parseFloat(entradaMin.value)) return false
    if (entradaMax.value && valorEntrada > parseFloat(entradaMax.value)) return false

    return true
  })
})

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

onMounted(() => {
  buscarCartas()
})
</script>

<template>
  <div class="home-container">
    
    <AppHeader />

    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Cartas Contempladas</h1>
        <p>Agilidade, economia e oportunidade para realizar seu sonho.</p>
      </div>
    </section>

    <div class="filter-section-wrapper">
      <div class="filter-bar">
        <div class="filter-group">
          <label>Tipo de Bem</label>
          <select v-model="filtroTipo">
            <option value="">Todos</option>
            <option value="IMOVEL">Imóvel</option>
            <option value="AUTOMOVEL">Automóvel</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Crédito (R$)</label>
          <div class="range-inputs">
            <input type="number" v-model="creditoMin" placeholder="Mín" />
            <span>-</span>
            <input type="number" v-model="creditoMax" placeholder="Máx" />
          </div>
        </div>

        <div class="filter-group">
          <label>Entrada (R$)</label>
          <div class="range-inputs">
            <input type="number" v-model="entradaMin" placeholder="Mín" />
            <span>-</span>
            <input type="number" v-model="entradaMax" placeholder="Máx" />
          </div>
        </div>

        <div class="filter-group">
          <label>Administradora</label>
          <input type="text" v-model="filtroAdmin" placeholder="Ex: Bradesco" />
        </div>

        <div class="filter-actions">
            <button class="btn-clean" @click="limparFiltros" title="Limpar Filtros">
                ✕
            </button>
        </div>
      </div>
    </div>

    <section class="quick-categories">
      <h3>Escolha um segmento:</h3>
      <div class="categories-grid">
        <div class="cat-card" @click="selecionarCategoriaRapida('IMOVEL')" :class="{ active: filtroTipo === 'IMOVEL' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Imóvel</span>
        </div>

        <div class="cat-card" @click="selecionarCategoriaRapida('AUTOMOVEL')" :class="{ active: filtroTipo === 'AUTOMOVEL' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="7" cy="17" r="2"></circle>
            <circle cx="17" cy="17" r="2"></circle>
            <path d="M5 17h-2v-6l2-5h9l2 5v6h-2"></path>
            <path d="M9 17h6"></path>
          </svg>
          <span>Veículo</span>
        </div>
      </div>
    </section>

    <main class="main-content" id="resultados">
      <div v-if="carregando" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="cartasFiltradas.length === 0" class="empty-state">
        <p>Nenhuma carta encontrada com esses filtros.</p>
        <button @click="limparFiltros" class="btn-link">Limpar filtros</button>
      </div>

      <div v-else class="cards-grid">
        <CartaCard 
          v-for="carta in cartasFiltradas" 
          :key="carta.id" 
          :carta="carta" 
        />
      </div>
    </main>

    <AppFooter />

  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* --- HERO SECTION --- */
.hero-section {
  position: relative;
  height: 400px;
  background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.65); 
}

.hero-content {
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero-content p {
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
}

/* --- FILTER BAR --- */
.filter-section-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  margin-top: -50px;
}

.filter-bar {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1fr 0.2fr;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
}

.filter-group select, 
.filter-group input[type="text"] {
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  width: 100%;
  background-color: #f9fafb;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 5px;
}

.range-inputs input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #f9fafb;
}

.btn-clean {
  background: #ef4444;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-top: 22px;
  cursor: pointer;
}

/* --- QUICK CATEGORIES --- */
.quick-categories {
  text-align: center;
  padding: 60px 20px 40px;
}

.quick-categories h3 {
  color: #374151;
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 1.2rem;
}

.categories-grid {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.cat-card {
  width: 160px;
  height: 140px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.cat-card svg {
  width: 40px;
  height: 40px;
  stroke: #fbbf24;
}

.cat-card span {
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
}

.cat-card:hover, .cat-card.active {
  border-color: #1e3a8a;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.cat-card.active svg {
  stroke: #1e3a8a;
}

/* --- MAIN CONTENT --- */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 80px;
  width: 100%;
  flex: 1;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.loading, .empty-state {
  text-align: center;
  padding: 60px;
  color: #6b7280;
}

.btn-link {
  background: none;
  border: none;
  color: #1e3a8a;
  text-decoration: underline;
  margin-top: 10px;
  font-size: 1rem;
  cursor: pointer;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid #1e3a8a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 900px) {
  .filter-bar {
    grid-template-columns: 1fr 1fr;
    margin-top: 20px;
  }
  
  .filter-section-wrapper {
      margin-top: -30px;
  }
}

@media (max-width: 600px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .filter-bar {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  
  .filter-section-wrapper {
      margin-top: 0;
      background: #f8f9fa;
      padding-top: 20px;
  }
  
  .range-inputs {
    display: grid;
    grid-template-columns: 1fr 0.1fr 1fr;
    text-align: center;
  }
  
  .btn-clean {
      width: 100%;
      margin-top: 10px;
  }
}
</style>