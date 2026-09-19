# Plan de construccion — Agenda de contactos

Documento de ruta. No es codigo: define fases, orden y checkpoints antes de implementar.

**Stack (manual):** React + Vite + Tailwind CSS 3 + sql.js (SQLite en navegador)  
**Arquitectura:** Componente → Hook → Repositorio → SQLite  
**Reglas de codigo:** `.cursor/rules/codigo-util.mdc` (sin emojis, comentarios minimos, menos lineas)

---

## Estado actual (Fase 0 — hecha)

| Pieza | Estado |
|-------|--------|
| Vite + React + Tailwind + sql.js | Hecho |
| Esquema `contactos` | Hecho |
| `database.js` + persistencia localStorage | Hecho |
| `contactosRepo.js` (CRUD) | Hecho |
| `useContactos` | Hecho |
| Formulario + tarjeta + busqueda | Hecho |
| WhatsApp / compartir / vCard | Hecho |
| Ejercicios E1–E12 | Pendiente |
| README + agenda.db + video | Pendiente |

---

## Por que este orden

1. **CRUD primero (E1–E4):** endurece UX y esquema sin romper el modelo.
2. **Backup antes de grupos (E7 antes que E5):** al migrar a FK conviene poder exportar/restaurar.
3. **SQL fuerte (E5–E8):** concentra puntos de rúbrica (modelo + consultas).
4. **Producto (E9–E10):** plantillas y accesibilidad sobre base estable.
5. **IA al final (E11–E12):** +2 pts sin tumbar el nucleo si fallan.

No saltar E5 al inicio: reescribe el esquema y obliga a rehacer filtros/UI.

---

## Ruta por bloques

### Bloque A — CRUD usable

| Orden | ID | Que hacer | Archivos típicos | Checkpoint |
|-------|-----|-----------|------------------|------------|
| 1 | E1 | Columna `cumple`, date en form, mostrar dd/mm/aaaa | `esquema.js`, `contactosRepo.js`, `ContactoForm.jsx`, `ContactoCard.jsx` | **Hecho** — `npm test` |
| 2 | E2 | `DialogoConfirmar` (sin `window.confirm`) | `DialogoConfirmar.jsx`, `App.jsx` | **Hecho** — `npm test` |
| 3 | E3 | Orden en `ORDER BY` (mapa SQL autorizado) | `contactosRepo.js`, `useContactos.js`, `App.jsx` | **Hecho** — `npm test` |
| 4 | E4 | Vacío total vs búsqueda sin resultados | `EstadoVacio.jsx`, `App.jsx` | **Hecho** — `npm test` |

**Commit:** uno por ejercicio (`feat: E1 cumple`, etc.)

---

### Bloque B — SQL y datos (peso en rúbrica)

| Orden | ID | Que hacer | Notas |
|-------|-----|-----------|--------|
| 5 | E7 | Exportar / importar `agenda.db` | **Hecho** — `npm test` |
| 6 | E5 | Tabla `grupos` + `grupo_id` + FK + JOIN | **Hecho** — clave localStorage `v2` |
| 7 | E6 | Tabla `mensajes`; registrar al abrir WhatsApp | **Hecho** — `npm test` |
| 8 | E8 | `estadisticas.js` solo con SQL | **Hecho** — `npm test` |

**Checkpoint:** DB normalizada, backup funciona, panel stats ok.

---

### Bloque C — Producto

| Orden | ID | Que hacer |
|-------|-----|-----------|
| 9 | E9 | Tabla `plantillas`, variables `{nombre}`, elegir antes de WhatsApp — **Hecho** |
| 10 | E10 | Teclado, `aria-label`, 360px, foco visible — **Hecho** (Lighthouse manual al entregar) |

---

### Bloque D — Retos IA (+2 pts)

| Orden | ID | Que hacer |
|-------|-----|-----------|
| 11 | E11 | Levenshtein + fusionar duplicados — **Hecho** |
| 12 | E12 | Sugerir mensaje (LLM/local) + `REFLEXION-ETICA.md` — **Hecho** |

---

### Bloque E — Entrega formal

1. `README.md` (instalación, capturas, decisiones)
2. `agenda.db` de ejemplo (≥ 10 contactos)
3. Video 3 min (flujo + WhatsApp)
4. Repo en GitHub con commits por ejercicio

---

## Rúbrica (objetivo)

| Criterio | Pts | Bloques que lo cubren |
|----------|-----|------------------------|
| Modelo de datos | 4 | B (E5, E6, E7) |
| Consultas SQL | 4 | A E3 + B E5–E8 |
| Arquitectura React | 4 | Toda la ruta (capas) |
| Interfaz Tailwind | 3 | A E4 + C E10 |
| Integraciones | 3 | Fase 0 + B E6 + C E9 |
| Retos IA | 2 | D |
| **Total** | **20** | |

---

## Decisiones pendientes (acordar al llegar)

- [ ] E5: migrar contactos viejos a grupos por defecto vs limpiar `localStorage` y documentarlo
- [ ] E12: API/modelo a usar (clave, proxy, o mock si no hay cuota)
- [ ] Nombre del repo GitHub y datos del alumno en portada del manual

---

## Proximo paso de codigo

Cuando se apruebe este plan: **implementar E1 (cumpleaños)** y commit dedicado.

Hasta entonces: no tocar ejercicios; este archivo es la fuente de la ruta.
