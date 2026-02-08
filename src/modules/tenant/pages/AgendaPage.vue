<template>
  <v-container fluid class="agenda-page pa-6">

    <!-- HEADER -->
    <v-card class="agenda-header mb-6" flat>
      <div class="d-flex flex-wrap align-center justify-space-between gap-4">
        <div>
          <h2 class="text-h5 font-weight-bold">Agenda</h2>
          <span class="text-caption text-grey">
            Gestiona tus citas por día, semana o mes
          </span>
        </div>

        <!-- ACCIONES -->
        <div class="d-flex flex-wrap gap-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-calendar-plus"
            @click="openNewAppointment"
          >
            Nueva cita
          </v-btn>

          <v-btn variant="outlined" @click="setView('timeGridDay')">
            Día
          </v-btn>

          <v-btn variant="outlined" @click="setView('timeGridWeek')">
            Semana
          </v-btn>

          <v-btn variant="outlined" @click="setView('dayGridMonth')">
            Mes
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- CALENDARIO -->
    <v-card class="calendar-card">
      <AgendaCalendar ref="calendarRef" />
    </v-card>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import AgendaCalendar from '@/modules/tenant/components/AgendaCalendar.vue'

const calendarRef = ref(null)

function setView(viewName) {
  calendarRef.value?.changeView(viewName)
}

function openNewAppointment() {
  // Más adelante: abrir modal
  console.log('Nueva cita')
}
</script>

<style scoped>
.agenda-page {
  background-color: #f8fafc;
  min-height: 100%;
}

.agenda-header {
  background: linear-gradient(90deg, #f1f5f9, #ffffff);
  border-radius: 16px;
  padding: 20px;
}

.calendar-card {
  border-radius: 18px;
  padding: 12px;
}
</style>
