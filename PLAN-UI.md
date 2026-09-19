# Plan UI — Capsula Lucid adaptada a Agenda

Objetivo: copiar **colores, iconos, formas y layout** de la captura Lucid.  
Solo cambian **nombres / etiquetas** y el **contenido** (contactos en vez de documentos).

No reinventar el diseno. No agregar pantallas nuevas fuera de este mapa.

---

## 1. Que se mantiene tal cual (visual)

| Pieza Lucid | Que conservar |
|-------------|----------------|
| Sidebar oscuro izquierdo | Fondo carbon, texto claro, logo arriba |
| Boton azul `+ Nuevo` | Misma forma, mismo azul accion |
| Columna secundaria gris | Lista con iconos lineales finos |
| Top bar oscura | Buscador centrado, iconos a la derecha |
| Area blanca principal | Titulo grande + lista + estado vacio |
| Iconos | Estilo lineal fino (SVG), mismos “tipos” de icono |
| Radios / espaciado | Casi recto, poco redondeo, mucho aire |

Paleta aproximada (igual que la captura):

- Carbon sidebar/top: `#1C1E21`
- Panel secundario: `#F4F5F6`
- Fondo lista: `#FFFFFF`
- Azul accion: `#0066F5`
- Texto mute: gris medio Lucid

---

## 2. Mapa de nombres (Lucid → Agenda)

### Sidebar principal (oscuro)

| Lucid | Agenda | Que hace en nuestra app |
|-------|--------|-------------------------|
| Logo «Lucid» | Marca (`MARCA.nombre` en `src/brand.js`) | Identidad arriba-izquierda |
| PJ / programador / Personal | Iniciales + «Mi agenda» / «Personal» | Solo etiqueta (sin login real) |
| **+ Nuevo** | **+ Nuevo contacto** | Abre formulario crear |
| Inicio | Inicio | Lista todos los contactos |
| Documentos | Contactos | Misma lista (o foco en listado) |
| Plantillas | Plantillas | Abre gestor / selector de plantillas WhatsApp (E9) |
| Integraciones | Respaldo | Exportar / importar `.db` (E7) |

### Columna secundaria (gris)

| Lucid | Agenda | Que hace |
|-------|--------|----------|
| Recientes | Recientes | Lista + orden `recientes` |
| Marcado con estrellas | Favoritos | Filtra `favorito = 1` |
| Documentos ▾ | Grupos ▾ | Carpeta colapsable |
| → Mis documentos | → Mis grupos | Lista de grupos (Personal, Trabajo, SENATI, Familia, custom) |
| → Papelera | *(omitir o «Sin grupo»)* | No tenemos papelera real → no inventar borrado suave |
| Compartido conmigo | Compartir | Vista/ayuda: acciones compartir / vCard (o atajo a contactos con share) |

### Top bar

| Lucid | Agenda |
|-------|--------|
| Busca por titulo o contenido | Busca por nombre, apellido o telefono |
| Icono AI / ayuda / campana | Opcional: solo los que usemos (sin fake). Prioridad: limpio |
| Plan gratis / Subir de categoria | Quitar (no aplica) o mostrar contador «N contactos» |
| Avatar PJ | Iniciales de marca / usuario local |

### Area principal

| Lucid | Agenda |
|-------|--------|
| Titulo «Marcado con estrellas» | Titulo dinamico segun filtro (Favoritos, Recientes, nombre del grupo…) |
| Columnas Titulo / Modificado | Nombre / Telefono / Grupo (o Ultimo WhatsApp) |
| Estado vacio Destacados | Textos vacios E4 adaptados al filtro activo |
| Vista lista / cuadrícula | Lista primero; cuadrícula opcional despues (no bloquea) |

---

## 3. Que se agrega (funcional, no decoracion)

Solo cablear lo que **ya existe** en el proyecto a esta capsula:

1. **Shell Lucid** (3 columnas + top bar)
2. **Marca** en el hueco del logo (`src/brand.js`)
3. **Navegacion** Inicio / Contactos / Plantillas / Respaldo
4. **Filtros secundarios** Recientes, Favoritos, Grupos
5. **Buscador** del top bar → `texto` del hook
6. **+ Nuevo contacto** → vista formulario
7. **Lista de contactos** en el area blanca (cards o filas estilo tabla)
8. **Estados vacios** segun seccion activa
9. **Dialogos** actuales (borrar, importar, duplicado, plantillas) sin cambiar logica

Fuera de este plan (no ahora):

- Login real, notificaciones, upgrade, AI de Lucid
- Papelera con soft-delete
- Redibujar iconos “bonitos” distintos al estilo lineal

---

## 4. Fases de construccion UI

### Fase U1 — Capsula vacia
- Layout 3 columnas + top bar con colores exactos
- Marca + boton + Nuevo + nav con nombres Agenda
- Columna secundaria con labels mapeados (sin filtrar aun)
- Main con titulo + empty state de prueba
- **Test visual:** `npm run dev` — se ve como Lucid, textos nuestros

### Fase U2 — Conectar datos
- Buscador → filtro
- Recientes / Favoritos / Grupos → `orden` / `favorito` / `grupoId`
- Lista real de contactos en main
- + Nuevo y editar usan `ContactoForm`
- **Test:** `npm test` + smoke visual

### Fase U3 — Secciones extra
- Plantillas → flujo E9 (`SelectorPlantilla` / listado)
- Respaldo → export/import E7
- Empty states E4 por seccion
- **Test:** `npm test` completo

### Fase U4 — Pulido
- Iconos SVG lineales (mismos “tipos” que Lucid)
- Responsive: sidebar colapsable en movil
- Quitar restos del layout anterior
- **Check:** sin desborde 360px (E10)

---

## 5. Archivos que se tocaran

| Archivo | Rol |
|---------|-----|
| `src/brand.js` | Nombre / iniciales / eslogan |
| `src/App.jsx` | Shell Lucid + rutas de vista |
| `src/components/Shell*.jsx` (nuevo, si hace falta) | Sidebar, Subnav, Topbar |
| `src/index.css` + `tailwind.config.js` | Tokens de color Lucid |
| Cards / empty / form | Ajuste visual minimo (bordes, tipografia) |

Logica DB/hooks **no se reescribe**; solo se reubica en la capsula.

---

## 6. Criterio de “listo”

- Al lado de Lucid, mismos negros/azules/grises y misma jerarquia
- Ningun label dice «Documentos» / «Marcado con estrellas» / «Plan gratis»
- Todas las acciones del plan abren funciones reales de la agenda
- `npm test` sigue en verde

---

Nombre exacto de marca en el logo: **Prismo** (confirmado).

```js
// src/brand.js
nombre: 'Prismo'
iniciales: 'P'
eslogan: 'Agenda de contactos'
```

Di «dale U1» para construir la Fase U1 (capsula Lucid vacia con marca Prismo).

