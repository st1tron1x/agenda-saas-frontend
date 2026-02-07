<template>
  <v-dialog v-model="modelValue" max-width="500">
    <v-card rounded="lg">
      <v-card-title>Nuevo cliente</v-card-title>

      <v-card-text>
        <v-text-field label="Nombre completo" />
        <v-text-field label="Teléfono" />
        <v-text-field label="Correo" />
        <v-textarea label="Observaciones" rows="2" />
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