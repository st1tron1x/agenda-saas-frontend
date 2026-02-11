# Backend Kickoff Playbook (Windows + VS Code + GitHub)

Guía práctica para arrancar **hoy** el backend sin bloquearte y con una base estable para integrar con `agenda-saas-frontend`.

## 1) Estructura de carpetas recomendada

```text
PROYECTO_AGENDA/
├── agenda-saas-frontend/      # Vue/Vite (ya existe)
└── backend/                   # Django/DRF (nuevo)
```

### Estructura interna sugerida para `backend/`

```text
backend/
├── .vscode/
│   ├── settings.json
│   ├── launch.json
│   └── extensions.json
├── .env.example
├── .gitignore
├── pyproject.toml             # o requirements/*.txt
├── Makefile                   # opcional (Windows puede usar scripts .ps1)
├── manage.py
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── local.py
│   │   ├── staging.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── platform/              # tenants, plans, subscriptions (schema public)
│   ├── tenancy/               # middleware schema + provisioning
│   ├── authn/                 # JWT/login/refresh/profile
│   ├── clients/
│   ├── services/
│   ├── agenda/
│   └── common/
├── scripts/
│   ├── bootstrap_local.ps1
│   ├── backup_tenant.sh
│   └── restore_tenant.sh
└── tests/
```

## 2) Estrategia de repositorio (GitHub)

Tienes 2 opciones válidas:

1. **Dos repos separados** (frontend y backend):
   - `agenda-saas-frontend`
   - `agenda-saas-backend`
   - Recomendado si trabajas por equipos distintos o despliegues separados.

2. **Monorepo** (`PROYECTO_AGENDA` con dos carpetas):
   - Recomendado si eres solo o equipo pequeño y quieres sincronizar cambios de contrato API más rápido.

### Recomendación práctica ahora

- Mantén frontend como está.
- Crea repo nuevo para `backend/`.
- Agrega en frontend un documento de contrato API versionado (ya tienes base en `docs/tenant-schema-provisioning.md`).

## 3) Flujo Git seguro (evitar errores en VS Code)

## Config global (Windows)

```bash
git config --global core.autocrlf false
git config --global core.eol lf
git config --global pull.rebase false
git config --global fetch.prune true
git config --global init.defaultBranch main
```

## `.gitattributes` recomendado

```gitattributes
* text=auto eol=lf
*.bat text eol=crlf
*.ps1 text eol=crlf
```

## Ramas

- `main`: estable
- `develop` (opcional)
- `feature/backend-tenants-provisioning`
- `feature/backend-tv-display-endpoints`

## Regla diaria

- PRs pequeños
- Un feature por PR
- Siempre correr tests/build antes de push

## 4) Backend: primer entregable funcional (hoy)

Objetivo: conectar frontend con backend mínimo.

### Endpoints mínimos

- `GET /api/platform/plans`
- `POST /api/platform/tenants`
- `GET /api/tenant/appointments/tv-display`
- `GET /api/tenant/display-info`

### Para `POST /api/platform/tenants`

Debe recibir payload compatible con el front actual (`provisioning` + `db_function_payload`) y devolver:

```json
{
  "id": "uuid-or-int",
  "schema_name": "tenant_1",
  "admin_password": "temp-pass",
  "provisioning_status": "completed"
}
```

## 5) Multi-tenant schema: orden de implementación

1. Tabla `public.tenants` + `public.plans`.
2. Servicio de provisioning (Python) que:
   - valida subdomain,
   - crea schema,
   - ejecuta migraciones del tenant,
   - ejecuta seed inicial,
   - registra estado.
3. Middleware para resolver tenant por subdominio/header.
4. Endpoints tenant-aware.

> Nota: evita meter toda la lógica en una función SQL gigante; deja SQL mínimo y la orquestación fuerte en Django para trazabilidad y testing.

## 6) VS Code recomendado para backend

`.vscode/settings.json` sugerido:

```json
{
  "python.defaultInterpreterPath": ".venv/Scripts/python.exe",
  "python.analysis.typeCheckingMode": "basic",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  "files.eol": "\n"
}
```

Extensiones mínimas:
- Python (ms-python.python)
- Pylance
- Ruff o Black formatter
- PostgreSQL (opcional)

## 7) Checklist de hoy (bloque de ejecución)

- [ ] Crear carpeta `backend/` y repo Git.
- [ ] Crear entorno virtual Python 3.11.
- [ ] Instalar Django + DRF + psycopg + jwt lib.
- [ ] Configurar `settings/base/local` y `.env`.
- [ ] Crear modelos `plans` y `tenants` (public).
- [ ] Crear endpoint `GET /platform/plans`.
- [ ] Crear endpoint `POST /platform/tenants` con provisioning básico.
- [ ] Probar desde frontend `TenantCreate.vue`.
- [ ] Confirmar que TV funciona con endpoint mock backend.

## 8) Definición de “listo hoy”

Se considera éxito hoy si puedes:

1. Crear un tenant desde frontend.
2. Ver respuesta backend con `schema_name`.
3. Tener datos de `GET /platform/plans` en frontend sin fallback.
4. Probar `GET /tenant/appointments/tv-display` en pantalla TV.

Con eso sales del bloqueo y entras a ciclo de avance continuo.