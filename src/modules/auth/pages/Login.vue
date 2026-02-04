<template>
  <v-card width="420" elevation="6">
    <v-card-title class="text-h6 text-center">
      Iniciar sesión
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field
          label="Correo o usuario"
          variant="outlined"
        />

        <v-text-field
          label="Contraseña"
          type="password"
          variant="outlined"
        />

        <v-btn
          block
          color="primary"
          class="mt-4"
        >
          Entrar
        </v-btn>

        <v-btn
          variant="text"
          block
          class="mt-2"
          to="/forgot-password"
        >
          ¿Olvidaste tu contraseña?
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
