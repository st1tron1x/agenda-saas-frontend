# 📅 Agenda SaaS - Sistema Multi-Tenant de Gestión de Citas

Sistema SaaS para gestión de agendas, clientes y servicios orientado a negocios de belleza, estética y salud.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN PANEL                        │
│  - Gestión de tenants (crear, pausar, editar)              │
│  - Gestión de planes y suscripciones                       │
│  - Sistema de impersonación                                │
│  - Dashboard con métricas globales                         │
│  - Soporte y tickets                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   TENANT INSTANCES                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  TENANT ADMIN                                        │  │
│  │  ✓ Dashboard con KPIs y gráficas                     │  │
│  │  ✓ Gestión de agenda (día/semana/mes)               │  │
│  │  ✓ CRM de clientes con historial                    │  │
│  │  ✓ Catálogo de servicios                            │  │
│  │  ✓ Gestión de usuarios y permisos                   │  │
│  │  ✓ Reportes financieros                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  STAFF (Colaboradores)                               │  │
│  │  ✓ Vista de agenda personal                          │  │
│  │  ✓ Inicio/fin de atención de citas                   │  │
│  │  ✓ Visualización de comisiones                       │  │
│  │  ✓ Gestión básica de clientes                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Stack Tecnológico

### Frontend
- **Vue 3** (Composition API)
- **Vuetify 3** (Material Design)
- **Vue Router 4**
- **Pinia** (State Management) - *Pendiente migración*
- **Axios** (HTTP Client)
- **ApexCharts** (Gráficas)
- **Tailwind CSS** (Utilidades)

### Backend *(En desarrollo)*
- **Django 5** + Django REST Framework
- **PostgreSQL** (Base de datos principal)
- **Redis** (Cache y sesiones)
- **Celery** (Tareas asíncronas)
- **JWT** (Autenticación)

## 📦 Instalación

### Requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Python >= 3.11 *(para backend)*
- PostgreSQL >= 15 *(para backend)*

### Setup Frontend

```bash
# Clonar repositorio
git clone <url-repo>
cd agenda-saas-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

Editar `.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_ENV=development
VITE_DEFAULT_TENANT=default
```

## 🎨 Estructura del Proyecto

```
src/
├── app/
│   ├── App.vue                    # Componente raíz
│   └── main.js                    # Punto de entrada
├── components/                     # Componentes globales
│   ├── AppFooter.vue
│   ├── PlatformSidebar.vue
│   ├── NotificationContainer.vue  # Sistema de notificaciones
│   └── ...
├── modules/
│   ├── auth/                      # Módulo de autenticación
│   │   └── pages/
│   ├── platform/                  # Módulo Super Admin
│   │   ├── pages/
│   │   │   ├── Dashboard.vue
│   │   │   ├── TenantsList.vue
│   │   │   └── TenantCreate.vue
│   │   └── components/
│   └── tenant/                    # Módulo Tenant
│       ├── pages/
│       │   ├── TenantDashboard.vue
│       │   ├── AgendaPage.vue
│       │   ├── ClientsPage.vue
│       │   └── ServicesPage.vue
│       └── components/
├── layouts/                       # Layouts de página
│   ├── AuthLayout.vue
│   ├── PlatformLayout.vue
│   └── AppLayout.vue
├── router/                        # Configuración de rutas
│   └── index.js
├── stores/                        # Estado global
│   └── auth.js
├── services/                      # Servicios API
│   ├── api.js                    # Cliente HTTP centralizado
│   ├── auth.service.js
│   └── tenant.service.js
├── composables/                   # Composables reutilizables
│   ├── useTenant.js
│   └── useNotification.js
├── constants/                     # Constantes
│   ├── roles.js
│   └── permissions.js
├── config/                        # Configuraciones
│   ├── sidebar.menu.js
│   └── role.permissions.js
└── tenants/                       # Configuración de tenants (MOCK)
    └── tenant.config.js
```

## 🔐 Sistema de Roles y Permisos

### Roles

```javascript
ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',      // Administrador de la plataforma
  TENANT_ADMIN: 'TENANT_ADMIN',    // Administrador del tenant
  STAFF: 'STAFF',                  // Colaborador del tenant
}
```

### Permisos

```javascript
PERMISSIONS = {
  // Plataforma
  TENANT_VIEW, TENANT_CREATE, TENANT_EDIT, TENANT_PAUSE,
  PLAN_VIEW, PLAN_EDIT,
  
  // Tenant
  APPOINTMENT_VIEW, APPOINTMENT_CREATE, APPOINTMENT_EDIT,
  CLIENT_VIEW, CLIENT_CREATE, CLIENT_EDIT,
  SERVICE_VIEW, SERVICE_CREATE, SERVICE_EDIT,
  USER_VIEW, USER_EDIT,
}
```

## 🧪 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor dev en http://localhost:5173

# Build
npm run build           # Genera build de producción en /dist
npm run preview         # Preview del build de producción

# Linting
npm run lint            # Ejecuta ESLint
npm run format          # Formatea código con Prettier
```

### Agregar Nuevo Tenant (MOCK)

Editar `src/tenants/tenant.config.js`:

```javascript
export const tenants = {
  nuevo_tenant: {
    id: 'nuevo_tenant',
    name: 'Nombre del Negocio',
    subdomain: 'subdominio',
    plan: 'Pro',
    active: true,
    logo: {
      src: '/logo.png',
      width: 240,
      aspectRatio: 1,
    },
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    gradient: 'linear-gradient(135deg, #6366F1, #EC4899)',
  },
}
```

## 🐛 Problemas Conocidos y Soluciones

### ❌ Iconos MDI no se muestran

**Solución:** Verificar que `@mdi/font` esté instalado:
```bash
npm install @mdi/font
```

Y en `src/plugins/vuetify.js`:
```javascript
import '@mdi/font/css/materialdesignicons.css'
```

### ❌ Error en navegación entre rutas

**Solución:** Verificar guards de autenticación en `router/index.js`

## 📋 Roadmap

### ✅ Completado
- [x] Sistema multi-tenant básico
- [x] Autenticación y roles
- [x] Dashboard con KPIs
- [x] Agenda (día/semana/mes)
- [x] Gestión de clientes
- [x] Gestión de servicios
- [x] Alertas de demoras en tiempo real

### 🚧 En Desarrollo
- [ ] Migración a Pinia
- [ ] Integración con backend Django
- [ ] Sistema de notificaciones push
- [ ] Upload de imágenes (antes/después)
- [ ] Reportes financieros avanzados

### 📅 Planificado
- [ ] Integración con Google Calendar
- [ ] Sistema de pagos (Stripe/PayU)
- [ ] Notificaciones SMS/WhatsApp
- [ ] App móvil (React Native)
- [ ] Sistema de inventario

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Propietario - Ing. Stiven Vanegas Jimenez

## 📞 Soporte

Para soporte técnico, contactar a: [tu-email]

---

**Nota:** Este proyecto está en desarrollo activo. Algunas funcionalidades pueden no estar completas.