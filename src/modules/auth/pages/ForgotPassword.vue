<template>
  <v-card width="420" elevation="6">
    <v-card-title class="text-h6 text-center">
      Recuperar contraseña
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field
          label="Correo electrónico"
          variant="outlined"
        />

        <v-btn
          block
          color="primary"
          class="mt-4"
        >
          Enviar enlace
        </v-btn>

        <v-btn
          variant="text"
          block
          class="mt-2"
          to="/login"
        >
          Volver al login
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
