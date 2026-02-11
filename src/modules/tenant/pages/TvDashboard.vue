<template>
  <div class="tv-display">
    <div
      class="tv-header"
      :style="headerStyle"
    >
      <div class="logo-section">
        <div class="logo-placeholder">
          <v-icon
            size="48"
            color="white"
          >
            mdi-store
          </v-icon>
        </div>
        <div class="business-info">
          <h1 class="business-name">
            {{ tenantInfo.business_name }}
          </h1>
          <p class="business-tagline">
            {{ tenantInfo.tagline }}
          </p>
        </div>
      </div>

      <div class="datetime-section">
        <div class="current-time">
          {{ currentTime }}
        </div>
        <div class="current-date">
          {{ currentDate }}
        </div>
      </div>
    </div>

    <div class="tv-content">
      <v-row
        class="fill-height"
        no-gutters
      >
        <v-col
          cols="12"
          md="4"
          class="left-column"
        >
          <div
            class="status-card in-service"
            :style="cardStyle"
          >
            <div class="card-header">
              <v-icon
                size="32"
                color="white"
              >
                mdi-account-check
              </v-icon>
              <h2>EN ATENCIÓN</h2>
            </div>
            <div class="card-content">
              <transition-group
                name="slide-fade"
                tag="div"
              >
                <div
                  v-for="appointment in inService"
                  :key="appointment.id"
                  class="appointment-item active"
                >
                  <div class="appointment-info">
                    <div class="client-name">
                      {{ appointment.client_name }}
                    </div>
                    <div class="service-info">
                      <v-icon size="16">
                        mdi-scissor-cutting
                      </v-icon>
                      {{ appointment.service_name }}
                    </div>
                    <div class="professional-info">
                      <v-icon size="16">
                        mdi-account-tie
                      </v-icon>
                      {{ appointment.professional_name }}
                    </div>
                  </div>
                  <div class="appointment-time">
                    <v-icon
                      size="20"
                      color="success"
                    >
                      mdi-clock-check
                    </v-icon>
                    <span>{{ appointment.start_time }}</span>
                  </div>
                </div>
              </transition-group>

              <div
                v-if="inService.length === 0"
                class="empty-state"
              >
                <v-icon
                  size="48"
                  color="grey-lighten-2"
                >
                  mdi-sleep
                </v-icon>
                <p>Ningún cliente en atención</p>
              </div>
            </div>
          </div>

          <div
            class="status-card calling"
            :style="cardStyle"
          >
            <div class="card-header calling-header">
              <v-icon
                size="32"
                color="white"
                class="bell-icon"
              >
                mdi-bell-ring
              </v-icon>
              <h2>LLAMANDO AHORA</h2>
            </div>
            <div class="card-content">
              <transition name="bounce">
                <div
                  v-if="currentCalling"
                  class="calling-item"
                >
                  <div class="calling-client">
                    <v-avatar
                      size="64"
                      :color="tenantInfo.primary_color"
                    >
                      <span class="text-h5 text-white">
                        {{ getInitials(currentCalling.client_name) }}
                      </span>
                    </v-avatar>
                    <div class="calling-details">
                      <div class="calling-name">
                        {{ currentCalling.client_name }}
                      </div>
                      <div class="calling-service">
                        {{ currentCalling.service_name }}
                      </div>
                      <div class="calling-professional">
                        Con {{ currentCalling.professional_name }}
                      </div>
                    </div>
                  </div>
                  <div class="calling-room">
                    <v-icon
                      size="48"
                      color="warning"
                    >
                      mdi-door-open
                    </v-icon>
                    <div class="room-number">
                      Sala {{ currentCalling.room }}
                    </div>
                  </div>
                </div>
              </transition>

              <div
                v-if="!currentCalling"
                class="empty-state"
              >
                <v-icon
                  size="48"
                  color="grey-lighten-2"
                >
                  mdi-bell-sleep
                </v-icon>
                <p>En espera...</p>
              </div>
            </div>
          </div>

          <div
            class="stats-card"
            :style="cardStyle"
          >
            <div class="stat-item">
              <v-icon
                size="32"
                :color="tenantInfo.primary_color"
              >
                mdi-calendar-check
              </v-icon>
              <div class="stat-content">
                <div class="stat-value">
                  {{ dailyStats.completed }}
                </div>
                <div class="stat-label">Completadas</div>
              </div>
            </div>
            <div class="stat-item">
              <v-icon
                size="32"
                color="info"
              >
                mdi-clock-outline
              </v-icon>
              <div class="stat-content">
                <div class="stat-value">
                  {{ dailyStats.pending }}
                </div>
                <div class="stat-label">Pendientes</div>
              </div>
            </div>
            <div class="stat-item">
              <v-icon
                size="32"
                color="warning"
              >
                mdi-account-clock
              </v-icon>
              <div class="stat-content">
                <div class="stat-value">
                  {{ dailyStats.waiting }}
                </div>
                <div class="stat-label">En Espera</div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="8"
          class="right-column"
        >
          <div
            class="waiting-list"
            :style="cardStyle"
          >
            <div class="section-header">
              <v-icon
                size="28"
                :color="tenantInfo.primary_color"
              >
                mdi-clock-time-four
              </v-icon>
              <h2>LISTA DE ESPERA</h2>
              <v-chip
                :color="tenantInfo.primary_color"
                size="large"
              >
                {{ waitingList.length }} personas
              </v-chip>
            </div>

            <div class="waiting-scroll">
              <transition-group
                name="list"
                tag="div"
              >
                <div
                  v-for="(appointment, index) in waitingList"
                  :key="appointment.id"
                  class="waiting-item"
                  :class="{ 'next-up': index === 0 }"
                >
                  <div class="queue-number">
                    <div
                      class="number-circle"
                      :style="numberCircleStyle(index)"
                    >
                      {{ index + 1 }}
                    </div>
                    <div
                      v-if="index === 0"
                      class="next-label"
                    >
                      ¡Siguiente!
                    </div>
                  </div>

                  <div class="waiting-details">
                    <div class="waiting-client">
                      {{ appointment.client_name }}
                    </div>
                    <div class="waiting-service">
                      <v-icon size="18">
                        mdi-content-cut
                      </v-icon>
                      {{ appointment.service_name }}
                      <v-chip
                        size="x-small"
                        class="ml-2"
                      >
                        {{ appointment.duration }}min
                      </v-chip>
                    </div>
                    <div class="waiting-professional">
                      <v-icon size="18">
                        mdi-account
                      </v-icon>
                      {{ appointment.professional_name }}
                    </div>
                  </div>

                  <div class="waiting-time">
                    <div class="scheduled-time">
                      {{ appointment.start_time }}
                    </div>
                    <div class="wait-duration">
                      <v-icon
                        size="16"
                        color="warning"
                      >
                        mdi-clock-alert
                      </v-icon>
                      Espera: {{ appointment.wait_time }}
                    </div>
                  </div>

                  <div
                    class="status-indicator"
                    :style="statusStyle(appointment.status)"
                  />
                </div>
              </transition-group>

              <div
                v-if="waitingList.length === 0"
                class="empty-waiting"
              >
                <v-icon
                  size="64"
                  color="grey-lighten-1"
                >
                  mdi-check-all
                </v-icon>
                <p class="text-h6">¡Todo al día!</p>
                <p class="text-caption">No hay personas en espera</p>
              </div>
            </div>
          </div>

          <div
            class="upcoming-section"
            :style="cardStyle"
          >
            <div class="section-header">
              <v-icon
                size="28"
                color="info"
              >
                mdi-calendar-clock
              </v-icon>
              <h2>PRÓXIMAS CITAS</h2>
            </div>

            <div class="upcoming-grid">
              <div
                v-for="appointment in upcomingAppointments"
                :key="appointment.id"
                class="upcoming-item"
              >
                <div class="upcoming-time">
                  <v-icon color="info">mdi-clock</v-icon>
                  {{ appointment.start_time }}
                </div>
                <div class="upcoming-info">
                  <div class="upcoming-client">
                    {{ appointment.client_name }}
                  </div>
                  <div class="upcoming-service">
                    {{ appointment.service_name }}
                  </div>
                </div>
                <v-avatar
                  size="40"
                  color="info"
                >
                  <span class="text-caption">{{ getInitials(appointment.professional_name) }}</span>
                </v-avatar>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      class="tv-footer"
      :style="footerStyle"
    >
      <div class="footer-message">
        <v-icon
          size="24"
          color="white"
        >
          mdi-information
        </v-icon>
        <span>{{ footerMessage }}</span>
      </div>
      <div class="footer-wifi">
        <v-icon
          size="20"
          color="white"
        >
          mdi-wifi
        </v-icon>
        <span>WiFi: {{ tenantInfo.wifi_name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentTime = ref('')
const currentDate = ref('')
const tenantInfo = ref({
  business_name: 'Spa & Wellness Center',
  tagline: 'Tu bienestar es nuestra prioridad',
  primary_color: '#6366F1',
  secondary_color: '#EC4899',
  wifi_name: 'Spa_WiFi',
})

const currentCalling = ref(null)
const inService = ref([])
const waitingList = ref([])
const upcomingAppointments = ref([])
const dailyStats = ref({
  completed: 0,
  pending: 0,
  waiting: 0,
})

const pendingCallTimeouts = []

const headerStyle = computed(() => ({
  background: `linear-gradient(135deg, ${tenantInfo.value.primary_color}, ${tenantInfo.value.secondary_color})`,
}))

const cardStyle = computed(() => ({
  '--primary-color': tenantInfo.value.primary_color,
  '--secondary-color': tenantInfo.value.secondary_color,
}))

const footerStyle = computed(() => ({
  backgroundColor: tenantInfo.value.primary_color,
}))

const footerMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '¡Buenos días! Gracias por tu visita'
  if (hour < 18) return '¡Buenas tardes! Gracias por preferirnos'
  return '¡Buenas noches! Que tengas un excelente día'
})

function updateDateTime() {
  const now = new Date()

  currentTime.value = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  currentDate.value = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function numberCircleStyle(index) {
  if (index === 0) {
    return {
      backgroundColor: tenantInfo.value.secondary_color,
      transform: 'scale(1.2)',
      boxShadow: `0 0 20px ${tenantInfo.value.secondary_color}`,
    }
  }
  return {
    backgroundColor: tenantInfo.value.primary_color,
  }
}

function statusStyle(status) {
  const colors = {
    waiting: '#FFA726',
    ready: '#66BB6A',
    delayed: '#EF5350',
  }
  return {
    backgroundColor: colors[status] || '#9E9E9E',
  }
}

async function loadTenantInfo() {
  const tenantId = route.params.tenantId || route.query.tenantId || 'demo'

  try {
    // TODO: Replace with API call
    // const response = await api.get(`/tenant/${tenantId}/display-info`)
    // tenantInfo.value = response.data
    console.debug('Loading tenant:', tenantId)
  } catch (error) {
    console.error('Error loading tenant info:', error)
  }
}

async function loadAppointmentsData() {
  try {
    // TODO: Replace with API call
    // const response = await api.get('/tenant/appointments/tv-display')
    // currentCalling.value = response.data.calling
    // inService.value = response.data.in_service
    // waitingList.value = response.data.waiting
    // upcomingAppointments.value = response.data.upcoming
    // dailyStats.value = response.data.stats

    currentCalling.value = {
      id: 1,
      client_name: 'María González',
      service_name: 'Masaje Relajante',
      professional_name: 'Laura Martínez',
      room: '3',
    }

    inService.value = [
      {
        id: 2,
        client_name: 'Carlos Ruiz',
        service_name: 'Corte + Barba',
        professional_name: 'Pedro López',
        start_time: '14:00',
      },
      {
        id: 3,
        client_name: 'Ana Silva',
        service_name: 'Manicure',
        professional_name: 'Carmen Díaz',
        start_time: '14:15',
      },
    ]

    waitingList.value = [
      {
        id: 4,
        client_name: 'Roberto Pérez',
        service_name: 'Facial Profundo',
        professional_name: 'Laura Martínez',
        start_time: '14:30',
        duration: 60,
        wait_time: '5 min',
        status: 'ready',
      },
      {
        id: 5,
        client_name: 'Lucía Fernández',
        service_name: 'Pedicure',
        professional_name: 'Carmen Díaz',
        start_time: '14:45',
        duration: 45,
        wait_time: '20 min',
        status: 'waiting',
      },
      {
        id: 6,
        client_name: 'Jorge Martín',
        service_name: 'Masaje Deportivo',
        professional_name: 'Pedro López',
        start_time: '15:00',
        duration: 90,
        wait_time: '35 min',
        status: 'waiting',
      },
    ]

    upcomingAppointments.value = [
      {
        id: 8,
        client_name: 'Miguel Ángel',
        service_name: 'Corte Clásico',
        professional_name: 'Pedro López',
        start_time: '16:00',
      },
      {
        id: 9,
        client_name: 'Elena Castro',
        service_name: 'Tratamiento Capilar',
        professional_name: 'Carmen Díaz',
        start_time: '16:15',
      },
      {
        id: 10,
        client_name: 'David Romero',
        service_name: 'Masaje Relajante',
        professional_name: 'Laura Martínez',
        start_time: '16:30',
      },
    ]

    dailyStats.value = {
      completed: 12,
      pending: 9,
      waiting: 4,
    }
  } catch (error) {
    console.error('Error loading appointments:', error)
  }
}

function simulateCall() {
  const callingInterval = setInterval(() => {
    if (waitingList.value.length > 0 && !currentCalling.value) {
      const next = waitingList.value.shift()
      currentCalling.value = {
        ...next,
        room: Math.floor(Math.random() * 5) + 1,
      }

      const timeoutId = setTimeout(() => {
        if (currentCalling.value) {
          inService.value.push({
            id: currentCalling.value.id,
            client_name: currentCalling.value.client_name,
            service_name: currentCalling.value.service_name,
            professional_name: currentCalling.value.professional_name,
            start_time: currentCalling.value.start_time,
          })
          currentCalling.value = null
        }
      }, 15000)

      pendingCallTimeouts.push(timeoutId)
    }
  }, 30000)

  return callingInterval
}

let dateTimeInterval
let dataRefreshInterval
let callingSimulation

onMounted(() => {
  updateDateTime()
  dateTimeInterval = setInterval(updateDateTime, 1000)

  loadTenantInfo()
  loadAppointmentsData()

  dataRefreshInterval = setInterval(loadAppointmentsData, 30000)
  callingSimulation = simulateCall()
})

onUnmounted(() => {
  clearInterval(dateTimeInterval)
  clearInterval(dataRefreshInterval)
  clearInterval(callingSimulation)
  pendingCallTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
})
</script>

<style scoped>
.tv-display {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
}

.tv-header {
  padding: 24px 48px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgb(0 0 0 / 15%);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo-placeholder {
  width: 80px;
  height: 80px;
  background-color: rgb(255 255 255 / 20%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.business-name {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgb(0 0 0 / 20%);
}

.business-tagline {
  font-size: 18px;
  margin: 4px 0 0;
  opacity: 0.95;
}

.datetime-section {
  text-align: right;
}

.current-time {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 4px rgb(0 0 0 / 20%);
}

.current-date {
  font-size: 20px;
  margin-top: 8px;
  opacity: 0.95;
  text-transform: capitalize;
}

.tv-content {
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

.left-column {
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-column {
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-card,
.stats-card,
.waiting-list,
.upcoming-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
  overflow: hidden;
}

.card-header {
  background: var(--primary-color);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.calling-header {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgb(255 107 107 / 50%);
  }

  50% {
    box-shadow: 0 0 40px rgb(255 107 107 / 80%);
  }
}

.bell-icon {
  animation: ring 1s ease-in-out infinite;
}

@keyframes ring {
  0%,
  100% {
    transform: rotate(0deg);
  }

  10%,
  30% {
    transform: rotate(-10deg);
  }

  20%,
  40% {
    transform: rotate(10deg);
  }

  50% {
    transform: rotate(0deg);
  }
}

.card-content {
  padding: 24px;
  min-height: 200px;
}

.in-service .card-content {
  max-height: 320px;
  overflow-y: auto;
}

.appointment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 12px;
  border-left: 4px solid var(--primary-color);
}

.appointment-item.active {
  background: linear-gradient(135deg, #e8f5e9, #f1f8f4);
  border-left-color: #4caf50;
}

.client-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.service-info,
.professional-info {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.appointment-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #4caf50;
}

.calling-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #fff5f5, #ffe8e8);
  border-radius: 16px;
  border: 3px solid #ff6b6b;
  animation: highlight 2s ease-in-out infinite;
}

@keyframes highlight {
  0%,
  100% {
    box-shadow: 0 0 20px rgb(255 107 107 / 30%);
  }

  50% {
    box-shadow: 0 0 40px rgb(255 107 107 / 60%);
  }
}

.calling-client {
  display: flex;
  align-items: center;
  gap: 20px;
}

.calling-name {
  font-size: 28px;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 4px;
}

.calling-service {
  font-size: 18px;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.calling-professional {
  font-size: 16px;
  color: #888;
}

.calling-room {
  text-align: center;
}

.room-number {
  font-size: 24px;
  font-weight: 700;
  color: #ff8e53;
  margin-top: 8px;
}

.stats-card {
  display: flex;
  justify-content: space-around;
  padding: 20px 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.section-header {
  padding: 20px 24px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.waiting-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.waiting-scroll {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 480px);
}

.waiting-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  margin-bottom: 16px;
  transition: all 0.3s;
  position: relative;
}

.waiting-item.next-up {
  background: linear-gradient(135deg, #fff9e6, #fff5cc);
  border-color: var(--secondary-color);
  box-shadow: 0 4px 16px rgb(236 72 153 / 20%);
  transform: scale(1.02);
}

.queue-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.number-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: 700;
  transition: all 0.3s;
}

.next-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--secondary-color);
  text-transform: uppercase;
}

.waiting-details {
  flex: 1;
}

.waiting-client {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
}

.waiting-service,
.waiting-professional {
  font-size: 15px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.waiting-time {
  text-align: right;
}

.scheduled-time {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.wait-duration {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}

.status-indicator {
  width: 12px;
  height: 80%;
  border-radius: 6px;
  position: absolute;
  right: 0;
  top: 10%;
}

.upcoming-section {
  height: 240px;
}

.upcoming-grid {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  max-height: 160px;
  overflow-y: auto;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 3px solid #2196f3;
}

.upcoming-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 700;
  color: #2196f3;
  min-width: 80px;
}

.upcoming-info {
  flex: 1;
}

.upcoming-client {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.upcoming-service {
  font-size: 13px;
  color: #666;
}

.empty-state,
.empty-waiting {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
}

.empty-state p,
.empty-waiting p {
  margin-top: 12px;
}

.tv-footer {
  padding: 20px 48px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4px 20px rgb(0 0 0 / 10%);
}

.footer-message,
.footer-wifi {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 500;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.8s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}
</style>