<template>
  <v-card class="pa-4 mb-4">
    <h3 class="text-subtitle-1 font-weight-medium mb-3">
      Fotos antes / después
    </h3>

    <v-file-input
      label="Subir imágenes"
      multiple
      accept="image/*"
      prepend-icon="mdi-camera"
    />
  </v-card>
</template>
