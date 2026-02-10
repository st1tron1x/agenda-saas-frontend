<template>
  <div class="plans-page">
    <div class="container">
      <h1>Planes y Precios</h1>
      <p class="subtitle">Elige el plan perfecto para tus necesidades</p>

      <div class="plans-grid">
        <!-- Plan Básico -->
        <div class="plan-card">
          <div class="plan-header">
            <h2>Básico</h2>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">9.99</span>
              <span class="period">/mes</span>
            </div>
          </div>
          <ul class="features">
            <li>✓ Funcionalidad 1</li>
            <li>✓ Funcionalidad 2</li>
            <li>✓ Soporte por email</li>
            <li>✓ 1 usuario</li>
          </ul>
          <button class="btn-plan">Seleccionar Plan</button>
        </div>

        <!-- Plan Pro -->
        <div class="plan-card featured">
          <div class="badge">Más Popular</div>
          <div class="plan-header">
            <h2>Pro</h2>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">29.99</span>
              <span class="period">/mes</span>
            </div>
          </div>
          <ul class="features">
            <li>✓ Todo lo del plan Básico</li>
            <li>✓ Funcionalidad premium 1</li>
            <li>✓ Funcionalidad premium 2</li>
            <li>✓ Soporte prioritario</li>
            <li>✓ Hasta 5 usuarios</li>
          </ul>
          <button class="btn-plan">Seleccionar Plan</button>
        </div>

        <!-- Plan Empresa -->
        <div class="plan-card">
          <div class="plan-header">
            <h2>Empresa</h2>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">99.99</span>
              <span class="period">/mes</span>
            </div>
          </div>
          <ul class="features">
            <li>✓ Todo lo del plan Pro</li>
            <li>✓ Funcionalidades empresariales</li>
            <li>✓ Integración API</li>
            <li>✓ Soporte 24/7</li>
            <li>✓ Usuarios ilimitados</li>
          </ul>
          <button class="btn-plan">Contactar Ventas</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlansPage',
  data() {
    return {
      selectedPlan: null
    }
  },
  methods: {
    selectPlan(planName) {
      this.selectedPlan = planName
      // Aquí puedes agregar la lógica para procesar la selección del plan
      console.log(`Plan seleccionado: ${planName}`)
    }
  }
}
</script>

<style scoped>
.plans-page {
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: white;
  font-size: 3rem;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 60px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.plan-card {
  background: white;
  border-radius: 15px;
  padding: 40px 30px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.plan-card.featured {
  border: 3px solid #667eea;
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -15px;
  right: 20px;
  background: #667eea;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.plan-header h2 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.price {
  margin-bottom: 30px;
}

.currency {
  font-size: 1.5rem;
  color: #667eea;
  vertical-align: top;
}

.amount {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
}

.period {
  color: #666;
  font-size: 1rem;
}

.features {
  list-style: none;
  padding: 0;
  margin: 30px 0;
}

.features li {
  padding: 12px 0;
  color: #555;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}

.features li:last-child {
  border-bottom: none;
}

.btn-plan {
  width: 100%;
  padding: 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-plan:hover {
  background: #5568d3;
}

.plan-card.featured .btn-plan {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .plan-card.featured {
    transform: scale(1);
  }
}
</style>