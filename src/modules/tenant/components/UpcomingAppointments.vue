<template>
  <v-card>
    <v-card-title>Próximas citas</v-card-title>

    <v-list>
      <v-list-item v-for="a in appointments" :key="a.id">
        <v-list-item-title>
          {{ a.time }} - {{ a.client }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ a.service }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
const appointments = [
  { id: 1, time: '10:00', client: 'Laura Gómez', service: 'Lifting de pestañas' },
  { id: 2, time: '11:30', client: 'María Ruiz', service: 'Micropigmentación labios' },
]
</script>