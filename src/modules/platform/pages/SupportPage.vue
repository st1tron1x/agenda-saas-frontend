<template>
  <div class="support-page">
    <div class="page-header">
      <h1>Centro de Soporte</h1>
      <p class="subtitle">Gestión de tickets y recursos de ayuda</p>
    </div>

    <!-- Tabs de navegación -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Tickets -->
    <div v-if="activeTab === 'tickets'" class="tab-content">
      <div class="content-header">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar tickets..."
          class="search-input"
        />
        <button @click="createTicket" class="btn-primary">
          + Nuevo Ticket
        </button>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <select v-model="filterStatus" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="open">Abiertos</option>
          <option value="in_progress">En Progreso</option>
          <option value="resolved">Resueltos</option>
          <option value="closed">Cerrados</option>
        </select>
        <select v-model="filterPriority" class="filter-select">
          <option value="">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>

      <!-- Lista de tickets -->
      <div class="tickets-list">
        <div 
          v-for="ticket in filteredTickets" 
          :key="ticket.id"
          class="ticket-card"
        >
          <div class="ticket-header">
            <span class="ticket-id">#{{ ticket.id }}</span>
            <span class="priority-badge" :class="ticket.priority">
              {{ getPriorityLabel(ticket.priority) }}
            </span>
          </div>
          <h3 class="ticket-title">{{ ticket.subject }}</h3>
          <p class="ticket-description">{{ ticket.description }}</p>
          <div class="ticket-footer">
            <span class="status-badge" :class="ticket.status">
              {{ getStatusLabel(ticket.status) }}
            </span>
            <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredTickets.length === 0" class="empty-state">
        <p>No se encontraron tickets</p>
      </div>
    </div>

    <!-- Tab: FAQ -->
    <div v-if="activeTab === 'faq'" class="tab-content">
      <div class="faq-section">
        <input 
          v-model="faqSearch" 
          type="text" 
          placeholder="Buscar en preguntas frecuentes..."
          class="search-input"
        />

        <div class="faq-list">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="faq-item"
          >
            <div 
              class="faq-question"
              @click="toggleFaq(index)"
            >
              <span>{{ faq.question }}</span>
              <span class="icon">{{ activeFaq === index ? '−' : '+' }}</span>
            </div>
            <div v-show="activeFaq === index" class="faq-answer">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Recursos -->
    <div v-if="activeTab === 'resources'" class="tab-content">
      <div class="resources-grid">
        <div 
          v-for="resource in resources" 
          :key="resource.id"
          class="resource-card"
        >
          <div class="resource-icon">{{ resource.icon }}</div>
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.description }}</p>
          <a :href="resource.link" class="resource-link">Ver más →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'SupportPage',
  setup() {
    const activeTab = ref('tickets')
    const searchQuery = ref('')
    const faqSearch = ref('')
    const filterStatus = ref('')
    const filterPriority = ref('')
    const activeFaq = ref(null)

    const tabs = [
      { id: 'tickets', label: 'Tickets' },
      { id: 'faq', label: 'Preguntas Frecuentes' },
      { id: 'resources', label: 'Recursos' }
    ]

    const tickets = ref([
      {
        id: 1001,
        subject: 'Error al crear tenant',
        description: 'No puedo crear un nuevo tenant desde el panel',
        status: 'open',
        priority: 'high',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 1002,
        subject: 'Consulta sobre planes',
        description: '¿Cómo puedo cambiar el plan de un tenant?',
        status: 'in_progress',
        priority: 'medium',
        createdAt: new Date('2024-01-14')
      },
      {
        id: 1003,
        subject: 'Problema con permisos',
        description: 'Un usuario no puede acceder a ciertas funciones',
        status: 'resolved',
        priority: 'low',
        createdAt: new Date('2024-01-10')
      }
    ])

    const faqs = [
      {
        question: '¿Cómo creo un nuevo tenant?',
        answer: 'Para crear un nuevo tenant, ve a la sección de Tenants y haz clic en "Nuevo Tenant". Completa el formulario con la información requerida.'
      },
      {
        question: '¿Cómo asigno un plan a un tenant?',
        answer: 'Puedes asignar o cambiar el plan de un tenant desde la página de edición del tenant, en la sección de "Plan y Facturación".'
      },
      {
        question: '¿Qué son las feature flags?',
        answer: 'Las feature flags te permiten activar o desactivar funcionalidades específicas para cada tenant sin necesidad de hacer cambios en el código.'
      },
      {
        question: '¿Cómo gestiono los permisos de usuario?',
        answer: 'Los permisos se gestionan a través de roles. Cada usuario tiene un rol asignado que define qué acciones puede realizar en el sistema.'
      }
    ]

    const resources = ref([
      {
        id: 1,
        icon: '📚',
        title: 'Documentación',
        description: 'Guías completas para administradores',
        link: '#'
      },
      {
        id: 2,
        icon: '🎥',
        title: 'Video Tutoriales',
        description: 'Aprende con tutoriales paso a paso',
        link: '#'
      },
      {
        id: 3,
        icon: '💡',
        title: 'Mejores Prácticas',
        description: 'Consejos para optimizar tu plataforma',
        link: '#'
      },
      {
        id: 4,
        icon: '🔧',
        title: 'API Reference',
        description: 'Documentación técnica de la API',
        link: '#'
      }
    ])

    const filteredTickets = computed(() => {
      let result = tickets.value

      if (searchQuery.value) {
        result = result.filter(ticket =>
          ticket.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      if (filterStatus.value) {
        result = result.filter(ticket => ticket.status === filterStatus.value)
      }

      if (filterPriority.value) {
        result = result.filter(ticket => ticket.priority === filterPriority.value)
      }

      return result
    })

    const filteredFaqs = computed(() => {
      if (!faqSearch.value) return faqs

      return faqs.filter(faq =>
        faq.question.toLowerCase().includes(faqSearch.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(faqSearch.value.toLowerCase())
      )
    })

    const toggleFaq = (index) => {
      activeFaq.value = activeFaq.value === index ? null : index
    }

    const getPriorityLabel = (priority) => {
      const labels = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        urgent: 'Urgente'
      }
      return labels[priority] || priority
    }

    const getStatusLabel = (status) => {
      const labels = {
        open: 'Abierto',
        in_progress: 'En Progreso',
        resolved: 'Resuelto',
        closed: 'Cerrado'
      }
      return labels[status] || status
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const createTicket = () => {
      console.log('Crear nuevo ticket')
      // Implementar lógica para crear ticket
    }

    return {
      activeTab,
      tabs,
      searchQuery,
      faqSearch,
      filterStatus,
      filterPriority,
      activeFaq,
      filteredTickets,
      filteredFaqs,
      resources,
      toggleFaq,
      getPriorityLabel,
      getStatusLabel,
      formatDate,
      createTicket
    }
  }
}
</script>

<style scoped>
.support-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6c757d;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e9ecef;
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #6c757d;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #495057;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.content-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.btn-primary {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #5568d3;
}

.tickets-list {
  display: grid;
  gap: 16px;
}

.ticket-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s;
}

.ticket-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ticket-id {
  font-weight: 600;
  color: #6c757d;
}

.priority-badge,
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-badge.low { background: #d1ecf1; color: #0c5460; }
.priority-badge.medium { background: #fff3cd; color: #856404; }
.priority-badge.high { background: #f8d7da; color: #721c24; }
.priority-badge.urgent { background: #dc3545; color: white; }

.status-badge.open { background: #cce5ff; color: #004085; }
.status-badge.in_progress { background: #fff3cd; color: #856404; }
.status-badge.resolved { background: #d4edda; color: #155724; }
.status-badge.closed { background: #e2e3e5; color: #383d41; }

.ticket-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.ticket-description {
  color: #6c757d;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-date {
  font-size: 0.85rem;
  color: #6c757d;
}

.faq-section {
  max-width: 800px;
}

.faq-list {
  margin-top: 24px;
}

.faq-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.faq-question {
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #2c3e50;
  transition: background 0.2s;
}

.faq-question:hover {
  background: #f8f9fa;
}

.faq-question .icon {
  font-size: 1.5rem;
  color: #667eea;
}

.faq-answer {
  padding: 0 20px 16px 20px;
  color: #6c757d;
  line-height: 1.6;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  text-align: center;
  transition: all 0.2s;
}

.resource-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.resource-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.resource-card h3 {
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.resource-card p {
  color: #6c757d;
  margin: 0 0 16px 0;
  font-size: 0.9rem;
}

.resource-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.resource-link:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
  }
  
  .filters {
    flex-direction: column;
  }
}
</style>