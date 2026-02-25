// ═══════════════════════════════════════════════════════════════════
// src/services/appointments.service.js
// Servicio para gestión de citas
// ═══════════════════════════════════════════════════════════════════

import { api } from './api'

export const appointmentsService = {
  /**
   * Listar todas las citas
   * @param {Object} filters - { status, client, service, staff_member, search, page }
   */
  async list(filters = {}) {
    try {
      const response = await api.get('/appointments', { params: filters })
      return response
    } catch (error) {
      console.error('Error listando citas:', error)
      throw error
    }
  },

  /**
   * Obtener una cita por ID
   */
  async get(id) {
    try {
      const response = await api.get(`/appointments/${id}`)
      return response
    } catch (error) {
      console.error(`Error obteniendo cita ${id}:`, error)
      throw error
    }
  },

  /**
   * Crear nueva cita
   * @param {Object} data - { client, service, staff_member, start_datetime, end_datetime, duration, price, notes }
   */
  async create(data) {
    try {
      const response = await api.post('/appointments', data)
      return response
    } catch (error) {
      console.error('Error creando cita:', error)
      throw error
    }
  },

  /**
   * Actualizar cita existente
   */
  async update(id, data) {
    try {
      const response = await api.patch(`/appointments/${id}`, data)
      return response
    } catch (error) {
      console.error(`Error actualizando cita ${id}:`, error)
      throw error
    }
  },

  /**
   * Eliminar cita
   */
  async delete(id) {
    try {
      const response = await api.delete(`/appointments/${id}`)
      return response
    } catch (error) {
      console.error(`Error eliminando cita ${id}:`, error)
      throw error
    }
  },

  /**
   * Cambiar estado de una cita
   * @param {number} id 
   * @param {string} status - PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
   */
  async changeStatus(id, status) {
    try {
      const response = await api.patch(`/appointments/${id}/change_status`, { status })
      return response
    } catch (error) {
      console.error(`Error cambiando estado de cita ${id}:`, error)
      throw error
    }
  },

  /**
   * Vista de calendario - citas de un día específico
   * @param {string} date - Formato YYYY-MM-DD
   */
  async calendar(date) {
    try {
      const response = await api.get('/appointments/calendar', { 
        params: { date } 
      })
      return response
    } catch (error) {
      console.error(`Error obteniendo calendario para ${date}:`, error)
      throw error
    }
  },
}


// ═══════════════════════════════════════════════════════════════════
// src/services/clients.service.js
// Servicio para gestión de clientes
// ═══════════════════════════════════════════════════════════════════

export const clientsService = {
  /**
   * Listar todos los clientes
   * @param {Object} filters - { is_active, city, search, page }
   */
  async list(filters = {}) {
    try {
      const response = await api.get('/clients', { params: filters })
      return response
    } catch (error) {
      console.error('Error listando clientes:', error)
      throw error
    }
  },

  /**
   * Obtener un cliente por ID
   */
  async get(id) {
    try {
      const response = await api.get(`/clients/${id}`)
      return response
    } catch (error) {
      console.error(`Error obteniendo cliente ${id}:`, error)
      throw error
    }
  },

  /**
   * Crear nuevo cliente
   * @param {Object} data - { name, email, phone, address, city, birthdate, notes, tags }
   */
  async create(data) {
    try {
      const response = await api.post('/clients', data)
      return response
    } catch (error) {
      console.error('Error creando cliente:', error)
      throw error
    }
  },

  /**
   * Actualizar cliente existente
   */
  async update(id, data) {
    try {
      const response = await api.patch(`/clients/${id}`, data)
      return response
    } catch (error) {
      console.error(`Error actualizando cliente ${id}:`, error)
      throw error
    }
  },

  /**
   * Eliminar cliente
   */
  async delete(id) {
    try {
      const response = await api.delete(`/clients/${id}`)
      return response
    } catch (error) {
      console.error(`Error eliminando cliente ${id}:`, error)
      throw error
    }
  },

  /**
   * Obtener historial de citas del cliente
   */
  async history(id) {
    try {
      const response = await api.get(`/clients/${id}/history`)
      return response
    } catch (error) {
      console.error(`Error obteniendo historial de cliente ${id}:`, error)
      throw error
    }
  },
}


// ═══════════════════════════════════════════════════════════════════
// src/services/services.service.js
// Servicio para gestión de servicios
// ═══════════════════════════════════════════════════════════════════

export const servicesService = {
  /**
   * Listar todos los servicios
   * @param {Object} filters - { is_active, search, page }
   */
  async list(filters = {}) {
    try {
      const response = await api.get('/services', { params: filters })
      return response
    } catch (error) {
      console.error('Error listando servicios:', error)
      throw error
    }
  },

  /**
   * Obtener un servicio por ID
   */
  async get(id) {
    try {
      const response = await api.get(`/services/${id}`)
      return response
    } catch (error) {
      console.error(`Error obteniendo servicio ${id}:`, error)
      throw error
    }
  },

  /**
   * Crear nuevo servicio
   * @param {Object} data - { name, description, duration, price, color }
   */
  async create(data) {
    try {
      const response = await api.post('/services', data)
      return response
    } catch (error) {
      console.error('Error creando servicio:', error)
      throw error
    }
  },

  /**
   * Actualizar servicio existente
   */
  async update(id, data) {
    try {
      const response = await api.patch(`/services/${id}`, data)
      return response
    } catch (error) {
      console.error(`Error actualizando servicio ${id}:`, error)
      throw error
    }
  },

  /**
   * Eliminar servicio
   */
  async delete(id) {
    try {
      const response = await api.delete(`/services/${id}`)
      return response
    } catch (error) {
      console.error(`Error eliminando servicio ${id}:`, error)
      throw error
    }
  },
}


// ═══════════════════════════════════════════════════════════════════
// EJEMPLO DE USO EN COMPONENTES VUE
// ═══════════════════════════════════════════════════════════════════

/*
<script setup>
import { ref, onMounted } from 'vue'
import { appointmentsService } from '@/services/appointments.service'

const appointments = ref([])
const loading = ref(false)

async function loadAppointments() {
  loading.value = true
  try {
    const response = await appointmentsService.list({ 
      status: 'CONFIRMED',
      page: 1 
    })
    
    if (response.success) {
      appointments.value = response.data.results || response.data
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

async function createAppointment() {
  const data = {
    client: 1,
    service: 2,
    staff_member: 3,
    start_datetime: '2026-02-20T10:00:00Z',
    end_datetime: '2026-02-20T10:30:00Z',
    duration: 30,
    price: 25000,
    status: 'PENDING'
  }
  
  const response = await appointmentsService.create(data)
  if (response.success) {
    console.log('Cita creada:', response.data)
    loadAppointments() // Recargar lista
  }
}

onMounted(() => {
  loadAppointments()
})
</script>
*/