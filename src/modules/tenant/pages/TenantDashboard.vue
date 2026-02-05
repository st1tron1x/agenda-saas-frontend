<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">
      Dashboard
    </h1>

    <!-- KPIs rápidos -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="kpi">
          <div class="kpi-value">12</div>
          <div class="kpi-label">Citas hoy</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="kpi">
          <div class="kpi-value">3</div>
          <div class="kpi-label">En espera</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="kpi">
          <div class="kpi-value">8</div>
          <div class="kpi-label">Atendidas</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="kpi">
          <div class="kpi-value">2</div>
          <div class="kpi-label">Pendientes</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Agenda del día -->
    <v-card class="mt-6">
      <v-card-title class="font-weight-medium">
        Agenda de hoy
      </v-card-title>

      <v-divider />

      <v-list>
        <v-list-item v-for="cita in citas" :key="cita.id">
          <v-list-item-title>
            {{ cita.hora }} - {{ cita.cliente }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ cita.servicio }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
const citas = [
  { id: 1, hora: '09:00', cliente: 'Ana Gómez', servicio: 'Micropigmentación labios' },
  { id: 2, hora: '11:00', cliente: 'Laura Pérez', servicio: 'Lifting de pestañas' },
  { id: 3, hora: '14:00', cliente: 'María Ruiz', servicio: 'Diseño de cejas' },
]
</script>

<style scoped>
.kpi {
  padding: 20px;
  text-align: center;
}
.kpi-value {
  font-size: 32px;
  font-weight: bold;
}
.kpi-label {
  font-size: 13px;
  opacity: 0.7;
}
</style>