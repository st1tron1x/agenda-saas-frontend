<template>
  <v-form>
    <v-row>

      <!-- CLIENTE -->
      <v-col cols="12" md="8">
        <v-autocomplete
          label="Cliente"
          :items="clients"
          item-title="name"
          item-value="id"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-btn block variant="outlined">
          Nuevo cliente
        </v-btn>
      </v-col>

      <!-- SERVICIO -->
      <v-col cols="12" md="6">
        <v-select
          label="Servicio"
          :items="services"
        />
      </v-col>

      <v-col cols="6" md="3">
        <v-text-field type="date" label="Fecha" />
      </v-col>

      <v-col cols="6" md="3">
        <v-text-field type="time" label="Hora" />
      </v-col>

      <!-- ESTADO -->
      <v-col cols="12" md="6">
        <v-select
          label="Estado"
          :items="statusList"
        />
      </v-col>

      <!-- PROCEDIMIENTO -->
      <v-col cols="12">
        <v-textarea
          label="Procedimiento / Notas"
          rows="3"
        />
      </v-col>

    </v-row>
  </v-form>
</template>

<script setup>
const clients = [
  { id: 1, name: 'Ana Gómez' },
  { id: 2, name: 'Laura Pérez' }
]

const services = [
  'Micropigmentación',
  'Diseño de cejas',
  'Lifting de pestañas'
]

const statusList = [
  'Pendiente',
  'Confirmada',
  'En atención',
  'Finalizada',
  'Cancelada'
]
</script>