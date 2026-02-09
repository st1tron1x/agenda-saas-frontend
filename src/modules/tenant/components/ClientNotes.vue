<template>
  <v-card class="pa-4 mb-4">
    <h3 class="text-subtitle-1 font-weight-medium mb-3">
      Notas clínicas
    </h3>

    <v-textarea
      v-model="notes"
      rows="4"
      label="Observaciones"
    />

    <v-btn
      class="mt-2"
      color="primary"
      size="small"
      @click="save"
    >
      Guardar nota
    </v-btn>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const notes = ref('')

function save() {
  console.log('Guardar nota clínica:', notes.value)
}
</script>
