<template>
  <v-container fluid class="pa-6">

    <!-- HEADER CON ACCIONES -->
    <v-card class="section-card pa-4 mb-4">
      <v-row align="center">
        <v-col cols="12" md="4">
          <h2 class="text-h6 font-weight-bold">Agenda</h2>
          <span class="text-caption text-grey">
            Gestiona tu calendario de citas
          </span>
        </v-col>

        <v-col cols="12" md="8" class="text-right">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="mr-2"
            @click="openNewAppointment"
          >
            Nueva cita
          </v-btn>

          <v-btn
            variant="outlined"
            prepend-icon="mdi-google"
            class="mr-2"
          >
            Sincronizar con Google Calendar
          </v-btn>

          <v-btn-group variant="outlined" density="comfortable">
            <v-btn
              :variant="viewMode === 'day' ? 'flat' : 'outlined'"
              @click="viewMode = 'day'"
            >
              Día
            </v-btn>
            <v-btn
              :variant="viewMode === 'week' ? 'flat' : 'outlined'"
              @click="viewMode = 'week'"
            >
              Semana
            </v-btn>
            <v-btn
              :variant="viewMode === 'month' ? 'flat' : 'outlined'"
              @click="viewMode = 'month'"
            >
              Mes
            </v-btn>
          </v-btn-group>
        </v-col>
      </v-row>
    </v-card>

    <!-- NAVEGACIÓN DEL CALENDARIO -->
    <v-card class="section-card pa-4 mb-4">
      <v-row align="center">
        <v-col cols="auto">
          <v-btn
            icon
            variant="text"
            @click="navigateCalendar(-1)"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            variant="outlined"
            size="small"
            @click="goToToday"
          >
            Hoy
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            icon
            variant="text"
            @click="navigateCalendar(1)"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>

        <v-col>
          <h3 class="text-h6 font-weight-medium">
            {{ currentPeriodLabel }}
          </h3>
        </v-col>

        <v-col cols="auto">
          <v-select
            v-model="selectedStaff"
            :items="staffList"
            item-title="name"
            item-value="id"
            label="Filtrar por colaborador"
            density="comfortable"
            variant="outlined"
            hide-details
            style="min-width: 200px"
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- CALENDARIO -->
    <v-card class="section-card calendar-container">
      
      <!-- VISTA DÍA -->
      <div v-if="viewMode === 'day'" class="calendar-day-view">
        <CalendarDayView
          :date="currentDate"
          :appointments="filteredAppointments"
          @time-click="handleTimeSlotClick"
          @appointment-click="handleAppointmentClick"
        />
      </div>

      <!-- VISTA SEMANA -->
      <div v-else-if="viewMode === 'week'" class="calendar-week-view">
        <CalendarWeekView
          :start-date="weekStart"
          :appointments="filteredAppointments"
          @time-click="handleTimeSlotClick"
          @appointment-click="handleAppointmentClick"
        />
      </div>

      <!-- VISTA MES -->
      <div v-else class="calendar-month-view">
        <CalendarMonthView
          :current-date="currentDate"
          :appointments="filteredAppointments"
          @date-click="handleDateClick"
          @appointment-click="handleAppointmentClick"
        />
      </div>

    </v-card>

    <!-- MODAL DE CITA -->
    <AppointmentModal
      v-model="showModal"
      :appointment="selectedAppointment"
      @save="handleSave"
      @cancel="handleCancel"
    />

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppointmentModal from '@/modules/tenant/components/AppointmentModal.vue'
import CalendarDayView from '@/modules/tenant/components/CalendarDayView.vue'
import CalendarWeekView from '@/modules/tenant/components/CalendarWeekView.vue'
import CalendarMonthView from '@/modules/tenant/components/CalendarMonthView.vue'

const viewMode = ref('week') // 'day', 'week', 'month'
const currentDate = ref(new Date())
const selectedStaff = ref(null)
const showModal = ref(false)
const selectedAppointment = ref(null)

// Lista de colaboradores (MOCK - luego vendrá del backend)
const staffList = [
  { id: null, name: 'Todos' },
  { id: 1, name: 'Ana García - Micropigmentación' },
  { id: 2, name: 'Laura Pérez - Cejas y pestañas' },
  { id: 3, name: 'María Torres - Uñas' },
]

// MOCK DATA - Citas de ejemplo
const appointments = ref([
  {
    id: 1,
    clientId: 1,
    clientName: 'Ana Gómez',
    serviceId: 1,
    serviceName: 'Micropigmentación labios',
    staffId: 1,
    date: '2026-02-10',
    time: '09:00',
    duration: 120, // minutos
    status: 'CONFIRMADA',
    color: '#4CAF50',
  },
  {
    id: 2,
    clientId: 2,
    clientName: 'María Ruiz',
    serviceId: 2,
    serviceName: 'Diseño de cejas',
    staffId: 2,
    date: '2026-02-10',
    time: '11:00',
    duration: 90,
    status: 'PENDIENTE',
    color: '#FF9800',
  },
  {
    id: 3,
    clientId: 3,
    clientName: 'Laura Torres',
    serviceId: 3,
    serviceName: 'Lifting de pestañas',
    staffId: 2,
    date: '2026-02-11',
    time: '14:00',
    duration: 60,
    status: 'CONFIRMADA',
    color: '#4CAF50',
  },
])

// Computed
const filteredAppointments = computed(() => {
  if (!selectedStaff.value) return appointments.value
  return appointments.value.filter(a => a.staffId === selectedStaff.value)
})

const weekStart = computed(() => {
  const date = new Date(currentDate.value)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Lunes como inicio
  return new Date(date.setDate(diff))
})

const currentPeriodLabel = computed(() => {
  const options = { month: 'long', year: 'numeric' }
  
  if (viewMode.value === 'day') {
    return currentDate.value.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  
  if (viewMode.value === 'week') {
    const end = new Date(weekStart.value)
    end.setDate(end.getDate() + 6)
    
    return `${weekStart.value.getDate()} - ${end.getDate()} de ${
      weekStart.value.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
    }`
  }
  
  return currentDate.value.toLocaleDateString('es-CO', options)
})

// Methods
function navigateCalendar(direction) {
  const date = new Date(currentDate.value)
  
  if (viewMode.value === 'day') {
    date.setDate(date.getDate() + direction)
  } else if (viewMode.value === 'week') {
    date.setDate(date.getDate() + (direction * 7))
  } else {
    date.setMonth(date.getMonth() + direction)
  }
  
  currentDate.value = date
}

function goToToday() {
  currentDate.value = new Date()
}

function openNewAppointment() {
  selectedAppointment.value = {
    clientId: null,
    serviceId: null,
    staffId: selectedStaff.value,
    status: 'CONFIRMADA',
    date: currentDate.value.toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    notes: '',
  }
  showModal.value = true
}

function handleTimeSlotClick({ date, time }) {
  // Click en un espacio vacío del calendario
  selectedAppointment.value = {
    clientId: null,
    serviceId: null,
    staffId: selectedStaff.value,
    status: 'CONFIRMADA',
    date: date,
    time: time,
    duration: 60,
    notes: '',
  }
  showModal.value = true
}

function handleDateClick(date) {
  // Click en una fecha (vista mes)
  selectedAppointment.value = {
    clientId: null,
    serviceId: null,
    staffId: selectedStaff.value,
    status: 'CONFIRMADA',
    date: date.toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    notes: '',
  }
  showModal.value = true
}

function handleAppointmentClick(appointment) {
  // Click en una cita existente - abrir para editar
  selectedAppointment.value = { ...appointment }
  showModal.value = true
}

function handleSave(appointmentData) {
  console.log('Guardar cita:', appointmentData)
  
  // MOCK - Simular guardado
  if (appointmentData.id) {
    // Editar existente
    const index = appointments.value.findIndex(a => a.id === appointmentData.id)
    if (index > -1) {
      appointments.value[index] = { ...appointmentData }
    }
  } else {
    // Crear nueva
    const newAppointment = {
      ...appointmentData,
      id: Date.now(),
      color: appointmentData.status === 'CONFIRMADA' ? '#4CAF50' : '#FF9800',
    }
    appointments.value.push(newAppointment)
  }
  
  showModal.value = false
}

function handleCancel(appointment) {
  console.log('Cancelar cita:', appointment)
  
  // MOCK - Actualizar estado
  const index = appointments.value.findIndex(a => a.id === appointment.id)
  if (index > -1) {
    appointments.value[index].status = 'CANCELADA'
    appointments.value[index].color = '#F44336'
  }
  
  showModal.value = false
}
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}

.calendar-container {
  min-height: 600px;
  overflow: auto;
}

.calendar-day-view,
.calendar-week-view,
.calendar-month-view {
  padding: 16px;
}
</style>