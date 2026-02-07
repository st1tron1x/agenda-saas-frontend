<template>
  <v-dialog v-model="modelValue" max-width="500">
    <v-card rounded="lg">
      <v-card-title>Nueva cita</v-card-title>

      <v-card-text>
        <v-text-field label="Cliente" />
        <v-text-field label="Servicio" />
        <v-text-field label="Fecha" type="date" />
        <v-text-field label="Hora" type="time" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">
          Cancelar
        </v-btn>
        <v-btn color="primary">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
defineEmits(['update:modelValue'])
</script>