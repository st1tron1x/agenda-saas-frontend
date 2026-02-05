<!--{
  id: UUID,
  name: string,
  slug: string,                // para subdominio o routing
  plan: 'trial' | 'pro' | 'enterprise',
  status: 'active' | 'paused' | 'suspended',

  branding: {
    logo: string,
    primaryColor: string,
    secondaryColor: string,
  },

  legal: {
    businessName: string,
    nit: string,
    legalRepresentative: string,
    address: string,
    phone: string,
    email: string,
    city: string,
    country: 'CO',
  },

  admin: {
    name: string,
    email: string,
  },

  createdAt,
  updatedAt
}
-->
<template>
  <div class="tenant-create pa-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold">Crear nuevo Tenant</h1>
      <p class="text-body-2 text-grey">
        Registra un nuevo negocio dentro de la plataforma
      </p>
    </div>

    <v-row>
      <!-- FORM -->
      <v-col cols="12" md="7">
        <v-card class="pa-6 rounded-xl">
          <v-form>
            <v-text-field
              label="Nombre del negocio"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              label="Correo principal"
              type="email"
              variant="outlined"
            />

            <v-text-field
              label="Teléfono"
              variant="outlined"
            />

            <v-select
              label="Tipo de negocio"
              :items="businessTypes"
              variant="outlined"
            />

            <v-divider class="my-6" />

            <div class="d-flex justify-end">
              <v-btn variant="text" class="mr-3">
                Cancelar
              </v-btn>
              <v-btn color="primary">
                Crear Tenant
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <!-- VISUAL / INSIGHT -->
      <v-col cols="12" md="5">
        <v-card
          class="pa-6 rounded-xl insight-card"
          elevation="0"
        >
          <h3 class="text-h6 font-weight-medium mb-4">
            Impacto del Tenant
          </h3>

          <p class="text-body-2 mb-4">
            Cada tenant representa un negocio único con su propia identidad,
            clientes y experiencia.
          </p>

          <!-- Placeholder para gráfica -->
          <div class="chart-placeholder">
            Gráfica aquí (crecimiento / belleza / armonía)
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const businessTypes = [
  'Estética / Belleza',
  'Salud',
  'Wellness',
  'Consultorio',
  'Otro',
]
</script>

<style scoped>
.tenant-create {
  background-color: #f8fafc;
  min-height: 100vh;
}

.insight-card {
  background: linear-gradient(135deg, #f3e8ff, #fdf4ff);
}

.chart-placeholder {
  height: 200px;
  border-radius: 16px;
  background-color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
}
</style>
