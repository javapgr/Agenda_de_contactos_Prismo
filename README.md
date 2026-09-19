# Prismo — Agenda de contactos

Agenda web (lab SENATI): contactos, grupos, WhatsApp, plantillas, respaldo SQLite y estadisticas. Datos en el navegador con **sql.js**.

## Stack

- React 18 + Vite
- Tailwind CSS 3
- sql.js (SQLite en WebAssembly)
- Vitest

Arquitectura: **UI → hook (`useContactos`) → repositorio → SQLite**.

## Requisitos

- Node.js 18+
- npm

## Instalacion

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

## Scripts

| Comando | Que hace |
|---------|----------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build de produccion |
| `npm run preview` | Previsualizar build |
| `npm test` | Pruebas Vitest |
| `npm run export-db` | Genera `agenda.db` de ejemplo |

## Funciones principales

- CRUD de contactos (cumpleanos, favoritos, grupos)
- Busqueda y orden (nombre, recientes, grupo)
- WhatsApp con plantillas `{nombre}` y sugerencias de mensaje
- Compartir y descarga `.vcf`
- Exportar / importar `agenda.db`
- Estadisticas SQL + graficos
- Deteccion de duplicados (similitud)

## Base de ejemplo

El archivo `agenda.db` incluye al menos 10 contactos de demo. Se regenera con:

```bash
npm run export-db
```

En la app: vista **Respaldo** → exportar o importar.

## Despliegue en Vercel

1. Sube el repo a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. Framework: Vite (autodetectado). Build: `npm run build`, salida: `dist`.
4. Deploy.

La sesion (entrar / crear usuario) y la agenda viven en el **navegador de cada visitante** (`localStorage`). No hay backend ni Google OAuth.

## Sesion local

- **Crear usuario:** nombre + email (guardado en este navegador).
- **Iniciar sesion:** email ya registrado aqui.
- **Salir:** vuelve a la pantalla de entrada.

## Decisiones

- Persistencia en `localStorage` (clave `agenda_contactos_v4`); no hay servidor.
- Sesion de usuario local (`prismo_sesion_v1` / `prismo_usuarios_v1`).
- Grupos normalizados con FK (`grupo_id`); filtros y orden en SQL.
- Sugerencias de mensaje: LLM opcional (`VITE_LLM_URL` + `VITE_LLM_KEY`); si no hay clave, respaldo local.
- Marca de producto: **Prismo**.
- Reflexion etica del uso de IA: `REFLEXION-ETICA.md`.

## Capturas

Agrega aqui 2–3 capturas al entregar (lista de contactos, WhatsApp/plantilla, estadisticas).

## Video de entrega

Grabar ~3 minutos: crear/editar contacto, buscar, WhatsApp con plantilla, respaldo y estadisticas.

## Repo

https://github.com/javapgr/Agenda-de-contactos
