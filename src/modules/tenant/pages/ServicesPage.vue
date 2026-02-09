<template>
  <v-container fluid class="pa-6">

    <v-card class="section-card pa-4 mb-4 d-flex justify-space-between">
      <h2 class="text-h6 font-weight-bold">Servicios</h2>
      <v-btn color="primary" prepend-icon="mdi-plus">
        Nuevo servicio
      </v-btn>
    </v-card>

    <v-card class="section-card pa-4">
      <v-table>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Duración</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in services" :key="s.id">
            <td>{{ s.name }}</td>
            <td>{{ s.duration }} min</td>
            <td>${{ s.price.toLocaleString() }}</td>
            <td>
              <v-btn icon variant="text">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

  </v-container>
</template>

<script setup>
const services = [
  { id: 1, name: 'Labios', duration: 120, price: 350000 },
  { id: 2, name: 'Cejas', duration: 90, price: 250000 },
]
</script>

<style scoped>
.section-card {
  border-radius: 18px;
}
</style>