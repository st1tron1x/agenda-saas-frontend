# 🚀 Guía de Implementación - Nuevas Funcionalidades

## 📋 Resumen de Nuevas Características

Este documento detalla la implementación de las siguientes funcionalidades:

1. **Panel de Super Admin Completo** (Gestión de Tenants, Planes, Soporte)
2. **Gestión de Usuarios y Permisos** (Tenant Admin)
3. **Módulo de Historial del Cliente** (Notas de tratamiento + carga de documentos)
4. **Sistema de Notificaciones por Email** (Branding del tenant + Google Calendar)
5. **Integración WhatsApp** (Solicitudes de reprogramación)

---

## 🏗️ Arquitectura de las Nuevas Funcionalidades

### 1. Super Admin Panel

#### Componentes Creados:
- ✅ `/platform/TenantsPage.vue` - Gestión completa de tenants
- ✅ `/platform/PlansPage.vue` - Gestión de planes (ya creado)
- ✅ `/platform/SupportPage.vue` - Sistema de tickets (ya creado)

#### Características de TenantsPage.vue:
```
✓ CRUD completo de tenants
✓ Filtros avanzados (búsqueda, estado, plan)
✓ Estadísticas en tiempo real
✓ Activación/Suspensión de tenants
✓ Configuración de límites (usuarios, citas)
✓ Subdominios personalizados
✓ Vista detallada con métricas
```

#### Integración en el Router:
```javascript
// src/router/platform.js
{
  path: '/platform',
  component: () => import('@/layouts/PlatformLayout.vue'),
  meta: { requiresAuth: true, role: 'super_admin' },
  children: [
    {
      path: 'tenants',
      name: 'platform-tenants',
      component: () => import('@/views/platform/TenantsPage.vue'),
    },
    {
      path: 'plans',
      name: 'platform-plans',
      component: () => import('@/views/platform/PlansPage.vue'),
    },
    {
      path: 'support',
      name: 'platform-support',
      component: () => import('@/views/platform/SupportPage.vue'),
    },
  ],
}
```

---

### 2. Gestión de Usuarios y Permisos (Tenant Admin)

#### Componente Creado:
- ✅ `/tenant/UsersPage.vue`

#### Sistema de Permisos por Rol:
```javascript
rolePermissions = {
  admin: [
    // Citas
    'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
    // Clientes
    'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
    // Servicios
    'services.view', 'services.create', 'services.edit', 'services.delete',
    // Usuarios
    'users.view', 'users.create', 'users.edit', 'users.delete',
    // Reportes y Configuración
    'reports.revenue', 'reports.export', 'reports.analytics',
    'settings.view', 'settings.edit', 'settings.billing',
  ],
  staff: [
    // Permisos limitados
    'appointments.view', 'appointments.create', 'appointments.edit',
    'clients.view', 'clients.create', 'clients.edit',
    'services.view',
  ],
}
```

#### Integración en el Router:
```javascript
// src/router/tenant.js
{
  path: '/settings/users',
  name: 'users-management',
  component: () => import('@/views/tenant/UsersPage.vue'),
  meta: { requiresAuth: true, permission: 'users.view' },
}
```

---

### 3. Módulo de Historial del Cliente

#### Componente Creado:
- ✅ `/tenant/ClientHistoryPage.vue`

#### Funcionalidades:
```
✓ Timeline completo de interacciones
✓ Visitas con notas de tratamiento
✓ Fotos de procedimientos (antes/después)
✓ Notas clínicas
✓ Carga de documentos (consentimientos, recetas, etc.)
✓ Filtros por tipo de evento
✓ Panel de información médica rápida
```

#### Tipos de Documentos Soportados:
- PDF (consentimientos, recetas)
- Imágenes (JPG, PNG - fotos de procedimientos)
- Word (DOC, DOCX - historias clínicas)

#### Integración en el Router:
```javascript
// src/router/tenant.js
{
  path: '/clients/:id/history',
  name: 'client-history',
  component: () => import('@/views/tenant/ClientHistoryPage.vue'),
  meta: { requiresAuth: true, permission: 'clients.view' },
}
```

#### Enlace desde el CRM de Clientes:
```vue
<!-- En ClientsList.vue -->
<v-btn
  icon="mdi-history"
  size="small"
  @click="$router.push({ name: 'client-history', params: { id: client.id } })"
>
  Ver Historial
</v-btn>
```

---

### 4. Sistema de Notificaciones por Email

#### Servicio Creado:
- ✅ `emailService.js` - Servicio de envío de emails

#### Templates de Email Creados:
- ✅ `email-templates.html` - 3 templates con branding del tenant

#### Características:
```
✓ Plantillas HTML responsivas
✓ Logo y colores del tenant
✓ Botones de acción (Confirmar, Reprogramar, Cancelar)
✓ Información detallada de la cita
✓ Recordatorios automáticos
```

#### Integración con Google Calendar API:

**Backend Django - Configuración:**
```python
# backend/settings.py
GOOGLE_CALENDAR_ENABLED = env.bool('GOOGLE_CALENDAR_ENABLED', default=False)
GOOGLE_CLIENT_ID = env('GOOGLE_CLIENT_ID', default='')
GOOGLE_CLIENT_SECRET = env('GOOGLE_CLIENT_SECRET', default='')

# backend/requirements.txt
google-auth==2.26.0
google-auth-oauthlib==1.2.0
google-auth-httplib2==0.2.0
google-api-python-client==2.112.0
```

**Backend Django - Google Calendar Service:**
```python
# backend/services/google_calendar.py
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta

class GoogleCalendarService:
    def __init__(self, tenant):
        self.tenant = tenant
        self.credentials = self._get_credentials()
        
    def _get_credentials(self):
        # Load tenant's Google OAuth credentials from DB
        return Credentials(
            token=self.tenant.google_access_token,
            refresh_token=self.tenant.google_refresh_token,
            token_uri='https://oauth2.googleapis.com/token',
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
        )
    
    def create_event(self, appointment):
        service = build('calendar', 'v3', credentials=self.credentials)
        
        event = {
            'summary': f'{appointment.service.name} - {appointment.client.name}',
            'description': f'Cliente: {appointment.client.name}\nTeléfono: {appointment.client.phone}',
            'start': {
                'dateTime': appointment.start_datetime.isoformat(),
                'timeZone': self.tenant.timezone,
            },
            'end': {
                'dateTime': appointment.end_datetime.isoformat(),
                'timeZone': self.tenant.timezone,
            },
            'attendees': [
                {'email': appointment.client.email},
                {'email': appointment.staff.email},
            ],
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},  # 1 día antes
                    {'method': 'popup', 'minutes': 60},       # 1 hora antes
                ],
            },
        }
        
        created_event = service.events().insert(
            calendarId='primary',
            body=event,
            sendUpdates='all'  # Envía notificaciones a los asistentes
        ).execute()
        
        return created_event['id']
    
    def update_event(self, google_event_id, appointment):
        service = build('calendar', 'v3', credentials=self.credentials)
        
        event = service.events().get(
            calendarId='primary',
            eventId=google_event_id
        ).execute()
        
        event['start']['dateTime'] = appointment.start_datetime.isoformat()
        event['end']['dateTime'] = appointment.end_datetime.isoformat()
        
        updated_event = service.events().update(
            calendarId='primary',
            eventId=google_event_id,
            body=event,
            sendUpdates='all'
        ).execute()
        
        return updated_event
    
    def delete_event(self, google_event_id):
        service = build('calendar', 'v3', credentials=self.credentials)
        service.events().delete(
            calendarId='primary',
            eventId=google_event_id,
            sendUpdates='all'
        ).execute()
```

**Backend Django - Email Service:**
```python
# backend/services/email_service.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

class EmailService:
    def __init__(self, tenant):
        self.tenant = tenant
        
    def send_appointment_confirmation(self, appointment):
        context = {
            'client_name': appointment.client.name,
            'service_name': appointment.service.name,
            'staff_name': appointment.staff.name,
            'appointment_date': appointment.date.strftime('%A, %d de %B de %Y'),
            'appointment_time': appointment.time.strftime('%I:%M %p'),
            'duration': appointment.service.duration,
            'price': appointment.service.price,
            'address': self.tenant.address,
            'phone': self.tenant.phone,
            'business_name': self.tenant.business_name,
            'logo_url': self.tenant.logo_url,
            'primary_color': self.tenant.brand_color or '#6366F1',
            'confirmation_url': self._get_confirmation_url(appointment, 'accept'),
            'reschedule_url': self._get_confirmation_url(appointment, 'reschedule'),
            'cancel_url': self._get_confirmation_url(appointment, 'cancel'),
        }
        
        html_message = render_to_string('emails/appointment_confirmation.html', context)
        
        send_mail(
            subject=f'Confirmación de Cita - {self.tenant.business_name}',
            message='',  # Plain text version
            from_email=f'{self.tenant.business_name} <{settings.DEFAULT_FROM_EMAIL}>',
            recipient_list=[appointment.client.email],
            html_message=html_message,
            fail_silently=False,
        )
    
    def _get_confirmation_url(self, appointment, action):
        token = self._generate_token(appointment.id, action)
        return f'{settings.FRONTEND_URL}/appointment-action?token={token}&action={action}'
```

**Configuración SMTP en .env:**
```bash
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@miagenda.com

# Google Calendar API
GOOGLE_CALENDAR_ENABLED=True
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

### 5. Integración WhatsApp para Reprogramación

#### Flujo de Reprogramación:
```
1. Cliente hace clic en "Solicitar Reprogramación" en el email
2. Backend genera mensaje WhatsApp pre-formateado
3. Admin/Manager recibe notificación vía WhatsApp
4. Admin contacta al cliente para reprogramar
```

#### Implementación en el Backend:
```python
# backend/services/whatsapp_service.py
import urllib.parse

class WhatsAppService:
    def send_reschedule_request(self, appointment, admin_phone):
        message = f"""🔄 Solicitud de Reprogramación

Cliente: {appointment.client.name}
Servicio: {appointment.service.name}
Fecha actual: {appointment.date.strftime('%d/%m/%Y')} {appointment.time.strftime('%I:%M %p')}

El cliente ha solicitado reprogramar su cita.
Por favor contáctelo a: {appointment.client.phone}"""

        encoded_message = urllib.parse.quote(message)
        whatsapp_url = f"https://wa.me/{admin_phone}?text={encoded_message}"
        
        # Log the request
        RescheduleRequest.objects.create(
            appointment=appointment,
            admin_phone=admin_phone,
            message=message,
            whatsapp_url=whatsapp_url,
        )
        
        return whatsapp_url
```

---

## 📦 Archivos Creados

### Frontend (Vue.js):
1. ✅ `TenantsPage.vue` - Gestión de tenants (Super Admin)
2. ✅ `UsersPage.vue` - Gestión de usuarios y permisos (Tenant Admin)
3. ✅ `ClientHistoryPage.vue` - Historial clínico del cliente
4. ✅ `emailService.js` - Servicio de notificaciones por email
5. ✅ `email-templates.html` - Templates de email con branding

### Backend (Django) - A CREAR:
```
backend/
├── apps/
│   ├── platform/
│   │   ├── models.py (Tenant, Plan)
│   │   ├── views.py (CRUD tenants, plans)
│   │   └── serializers.py
│   ├── users/
│   │   ├── models.py (User con roles y permisos)
│   │   └── permissions.py
│   ├── clients/
│   │   ├── models.py (Client, ClientHistory, ClientDocument)
│   │   └── views.py
│   ├── appointments/
│   │   ├── models.py (Appointment)
│   │   └── views.py
│   └── notifications/
│       ├── services/
│       │   ├── email_service.py
│       │   ├── google_calendar.py
│       │   └── whatsapp_service.py
│       └── templates/
│           └── emails/
│               ├── appointment_confirmation.html
│               ├── appointment_reminder.html
│               └── appointment_cancellation.html
```

---

## 🔌 Endpoints API Necesarios

### Tenants (Super Admin):
```
GET    /api/platform/tenants/          - Listar todos los tenants
POST   /api/platform/tenants/          - Crear tenant
GET    /api/platform/tenants/{id}/     - Ver detalles
PUT    /api/platform/tenants/{id}/     - Actualizar
DELETE /api/platform/tenants/{id}/     - Eliminar
POST   /api/platform/tenants/{id}/suspend/   - Suspender
POST   /api/platform/tenants/{id}/activate/  - Activar
```

### Users (Tenant Admin):
```
GET    /api/tenant/users/              - Listar usuarios
POST   /api/tenant/users/              - Crear usuario
GET    /api/tenant/users/{id}/         - Ver detalles
PUT    /api/tenant/users/{id}/         - Actualizar
DELETE /api/tenant/users/{id}/         - Eliminar
PATCH  /api/tenant/users/{id}/toggle-status/ - Activar/Desactivar
```

### Client History:
```
GET    /api/tenant/clients/{id}/history/     - Historial completo
POST   /api/tenant/clients/{id}/notes/       - Crear nota
POST   /api/tenant/clients/{id}/documents/   - Subir documento
GET    /api/tenant/documents/{id}/download/  - Descargar documento
DELETE /api/tenant/documents/{id}/           - Eliminar documento
```

### Notifications:
```
POST   /api/notifications/send-email/           - Enviar email
POST   /api/notifications/test-email/           - Probar configuración
POST   /api/notifications/reschedule-request/   - Solicitud reprogramación
POST   /api/appointments/{id}/confirm/          - Confirmar cita
POST   /api/appointments/{id}/cancel/           - Cancelar cita
```

### Google Calendar:
```
POST   /api/integrations/google/authorize/      - Autorizar Google
POST   /api/integrations/google/callback/       - Callback OAuth
POST   /api/appointments/{id}/sync-calendar/    - Sincronizar con Google
```

---

## 🚀 Pasos de Implementación

### FASE 1: Integrar Frontend (1-2 días)
1. Copiar archivos `.vue` a las carpetas correspondientes
2. Actualizar rutas en `router/index.js`
3. Agregar enlaces en los menús laterales
4. Probar navegación y formularios

### FASE 2: Backend Django (1 semana)
1. Crear modelos de base de datos
2. Implementar serializadores DRF
3. Crear views y endpoints
4. Configurar permisos por rol
5. Implementar servicios (email, Google Calendar, WhatsApp)
6. Crear templates de email

### FASE 3: Integración API (2-3 días)
1. Conectar frontend con endpoints del backend
2. Manejar errores y validaciones
3. Implementar loaders y feedback visual
4. Probar flujos completos

### FASE 4: Testing y Deploy (3-4 días)
1. Pruebas unitarias backend
2. Pruebas de integración
3. Configurar variables de entorno
4. Deploy en VPS
5. Configurar SMTP y Google APIs en producción

---

## ⚙️ Configuración de Google APIs

### Paso 1: Crear Proyecto en Google Cloud Console
1. Ir a https://console.cloud.google.com
2. Crear nuevo proyecto
3. Habilitar APIs: Gmail API y Google Calendar API

### Paso 2: Configurar OAuth 2.0
1. Ir a "Credenciales"
2. Crear credenciales OAuth 2.0
3. Agregar URIs de redirección autorizadas:
   - `http://localhost:8000/api/integrations/google/callback/`
   - `https://tudominio.com/api/integrations/google/callback/`
4. Copiar Client ID y Client Secret al `.env`

### Paso 3: Configurar SMTP de Gmail
1. Activar "Verificación en 2 pasos" en tu cuenta Google
2. Generar "Contraseña de aplicación"
3. Usar esa contraseña en `EMAIL_HOST_PASSWORD`

---

## 📝 Próximos Pasos Recomendados

1. ✅ **Aplicar correcciones QA** del frontend (archivo PLAN-DE-ACCION-COMPLETO.md)
2. ✅ **Crear proyecto Django** siguiendo BACKEND-DJANGO-ARCHITECTURE.md
3. ✅ **Implementar autenticación JWT** entre frontend y backend
4. ✅ **Configurar Google APIs** en Google Cloud Console
5. ✅ **Probar emails** en ambiente de desarrollo
6. ✅ **Migrar a VPS** usando Docker Compose

---

## 💡 Notas Importantes

- **Seguridad**: Los tokens de confirmación de citas deben ser seguros y tener expiración
- **Performance**: Implementar caché para reducir consultas a la BD
- **Backup**: Configurar backups automáticos de documentos subidos
- **Límites**: Respetar límites de API de Google (10,000 solicitudes/día)
- **GDPR**: Implementar eliminación de datos personales bajo solicitud

---

## 📞 Soporte

Para preguntas sobre la implementación, consultar:
- README-COMPLETO.md
- BACKEND-DJANGO-ARCHITECTURE.md
- GUIA-IMPLEMENTACION-CODIGO.md