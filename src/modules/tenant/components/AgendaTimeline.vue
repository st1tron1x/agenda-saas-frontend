<template>
  <v-card class="section-card">
    <v-card-title>Agenda de hoy</v-card-title>
    <v-divider />

    <v-card-text class="timeline">
      <div
        v-for="item in agenda"
        :key="item.id"
        class="timeline-item"
      >
        <!-- Hora -->
        <div class="timeline-time">
          {{ item.time }}
        </div>

        <!-- Línea -->
        <div class="timeline-line">
          <span
            class="timeline-dot"
            :class="item.status"
          />
        </div>

        <!-- Contenido -->
        <div class="timeline-content">
          <div class="font-weight-medium">
            {{ item.client }}
          </div>

          <div class="text-caption text-grey">
            {{ item.service }}
          </div>

          <v-chip
            size="x-small"
            class="mt-1"
            :color="statusColor(item.status)"
            variant="flat"
          >
            {{ statusLabel(item.status) }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const agenda = [
  {
    id: 1,
    time: '09:00',
    client: 'Ana Gómez',
    service: 'Micropigmentación labios',
    status: 'pending',
  },
  {
    id: 2,
    time: '10:30',
    client: 'Laura Pérez',
    service: 'Lifting de pestañas',
    status: 'in_progress',
  },
  {
    id: 3,
    time: '12:00',
    client: 'María Ruiz',
    service: 'Diseño de cejas',
    status: 'done',
  },
  {
    id: 4,
    time: '14:00',
    client: 'Carolina Soto',
    service: 'Retoque labios',
    status: 'cancelled',
  },
]

function statusLabel(status) {
  return {
    pending: 'Pendiente',
    in_progress: 'En atención',
    done: 'Atendida',
    cancelled: 'Cancelada',
  }[status]
}

function statusColor(status) {
  return {
    pending: 'warning',
    in_progress: 'info',
    done: 'success',
    cancelled: 'error',
  }[status]
}
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 60px 20px 1fr;
  align-items: flex-start;
}

.timeline-time {
  font-weight: 600;
  color: #475569;
}

.timeline-line {
  position: relative;
  display: flex;
  justify-content: center;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
}

/* Estados */
.timeline-dot.pending {
  background-color: #f59e0b;
}
.timeline-dot.in_progress {
  background-color: #3b82f6;
}
.timeline-dot.done {
  background-color: #22c55e;
}
.timeline-dot.cancelled {
  background-color: #ef4444;
}
</style>