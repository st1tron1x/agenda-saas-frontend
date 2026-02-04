<template>
  <v-card width="420" elevation="6">
    <v-card-title class="text-h6 text-center">
      Restablecer contraseña
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field
          label="Nueva contraseña"
          type="password"
          variant="outlined"
        />

        <v-text-field
          label="Confirmar contraseña"
          type="password"
          variant="outlined"
        />

        <v-btn
          block
          color="primary"
          class="mt-4"
        >
          Guardar contraseña
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
