<template>
  <div class="d-flex justify-space-between align-center mb-6">
    <div>
      <h1 class="text-h5 font-weight-bold">
        Dashboard · Super Administrador
      </h1>
      <p class="text-caption text-grey">
        Visión general de la plataforma
      </p>
    </div>

    <v-btn variant="outlined" size="small">
      Últimos 30 días
    </v-btn>
  </div>

  <!--KPI Cards (impacto visual)-->
  <v-row class="mb-6">
  <v-col cols="12" md="3" v-for="kpi in kpis" :key="kpi.title">
    <v-card elevation="2">
      <v-card-text>
        <div class="text-caption text-grey">
          {{ kpi.title }}
        </div>
        <div class="text-h4 font-weight-bold">
          {{ kpi.value }}
        </div>
        <div class="text-caption text-success">
          {{ kpi.trend }}
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>

<!--Métricas técnicas (VPS)-->
<v-row class="mb-6">
  <v-col cols="12" md="6">
    <v-card>
      <v-card-title>Rendimiento del sistema</v-card-title>
      <v-card-text>
        <ul class="text-caption">
          <li>CPU: 35%</li>
          <li>RAM: 62%</li>
          <li>Disco: 48%</li>
          <li>Tenants en ejecución: 12</li>
        </ul>
      </v-card-text>
    </v-card>
  </v-col>

  <v-col cols="12" md="6">
    <v-card>
      <v-card-title>Salud de la plataforma</v-card-title>
      <v-card-text>
        <v-chip color="success">Sistema estable</v-chip>
        <p class="text-caption mt-2">
          Sin incidentes críticos reportados
        </p>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>

<!--Growth & Promociones-->
<v-card class="mb-6">
  <v-card-title>Crecimiento de la plataforma</v-card-title>
  <v-card-text>
    <div class="text-center text-grey">
      (Gráfica de crecimiento mensual — próximamente)
    </div>
  </v-card-text>
</v-card>
<v-card>
  <v-card-title>Ideas de promoción</v-card-title>
  <v-card-text>
    <ul class="text-caption">
      <li>Ofrecer upgrade a tenants con alto uso</li>
      <li>Contactar tenants inactivos</li>
      <li>Promoción por volumen de citas</li>
    </ul>
  </v-card-text>
</v-card>


</template>
<script setup>
const kpis = [
  { title: 'Tenants activos', value: 12, trend: '+2 este mes' },
  { title: 'Citas hoy', value: 184, trend: '+12%' },
  { title: 'Usuarios activos', value: 56, trend: '+5' },
  { title: 'Tenants en riesgo', value: 2, trend: 'Revisar' },
]

</script>