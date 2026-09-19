# Agenda de contactos con React, Tailwind CSS y SQLite

**SENATI** · Escuela de Tecnologías de la Información  
Ingeniería de Software con Inteligencia Artificial · V ciclo  
Manual de laboratorio y guía de ejercicios

---

## Resumen

Aplicación de contactos completa: registrar, editar, buscar, compartir y escribir por WhatsApp. Los datos se guardan en SQLite (vía WebAssembly) dentro del navegador.

Demo interactiva: https://claude.ai/artifact/RFD7TWGmqS4kn4mxkdkbrL

| Campo | Valor |
|--------|--------|
| Apellidos y nombres | |
| Unidad didáctica | |
| Sección / NRC | |
| Instructor | |
| Fecha de entrega | |

### Al terminar serás capaz de

- Diseñar un esquema SQLite con `NOT NULL`, `UNIQUE` y `CHECK`
- Separar la capa de datos de la interfaz (repositorio + hook)
- Escribir consultas parametrizadas y explicar por qué evitan inyección SQL
- Componer UI responsiva con Tailwind (sin CSS propio)
- Integrar WhatsApp, compartir del sistema y archivos vCard

**Requisitos previos:** JavaScript ES6, HTML semántico, nociones de SQL y Node.js 18+

---

## 1. Qué vamos a construir

App web sin servidor: todo corre en el navegador. SQLite compilado a WebAssembly persiste los datos (arquitectura offline-first).

### Flujo de cada acción

| Escalón | Responsabilidad |
|---------|-----------------|
| Componente React | Muestra info y captura la acción (ej. «Agregar contacto») |
| Repositorio | Traduce a SQL (`crearContacto()` arma el `INSERT`) |
| SQLite | Ejecuta, aplica restricciones y persiste |

**Regla de oro:** ningún componente escribe SQL. Los componentes piden datos; el repositorio habla con la base. Si mañana cambias SQLite por una API REST, solo reescribes el repositorio.

---

## 2. Preparar el proyecto

```bash
# 1. Crear el proyecto React con Vite
npm create vite@latest agenda-contactos -- --template react
cd agenda-contactos
npm install

# 2. Tailwind CSS
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# 3. SQLite para el navegador
npm install sql.js

# 4. Servidor de desarrollo
npm run dev
```

### `tailwind.config.js`

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: "#25D366"
      }
    }
  },
  plugins: []
}
```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, sans-serif;
}
```

**Error frecuente:** olvidar `import './index.css'` en `src/main.jsx`. Sin eso Tailwind no carga.

---

## 3. La base de datos

Define la estructura antes de la interfaz.

### `src/db/esquema.sql` (o `esquema.js`)

```sql
CREATE TABLE IF NOT EXISTS contactos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre    TEXT    NOT NULL,
  apellido  TEXT    NOT NULL DEFAULT '',
  telefono  TEXT    NOT NULL UNIQUE,
  email     TEXT,
  categoria TEXT    NOT NULL DEFAULT 'Personal'
    CHECK (categoria IN ('Personal','Trabajo','SENATI','Familia')),
  favorito  INTEGER NOT NULL DEFAULT 0 CHECK (favorito IN (0,1)),
  notas     TEXT,
  creado_en TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_contactos_nombre
  ON contactos(nombre);
```

### Por qué cada restricción

| Restricción | Motivo |
|-------------|--------|
| `INTEGER PRIMARY KEY AUTOINCREMENT` | SQLite genera el id. Nunca lo envíes desde React |
| `telefono TEXT` | No número: conserva ceros, `+` y espacios |
| `UNIQUE` | Impide teléfonos duplicados a nivel DB |
| `CHECK (categoria IN (...))` | Solo cuatro valores válidos |
| `favorito INTEGER` + `CHECK (0,1)` | SQLite no tiene booleano |
| `DEFAULT (datetime('now','localtime'))` | Fecha la pone el motor, no el navegador |

---

## 4. Conectar SQLite al navegador

`sql.js` carga SQLite como WASM. La base vive en memoria: tras cada escritura se exporta a `localStorage`; al recargar se restaura.

### `src/db/database.js`

```js
import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { ESQUEMA } from './esquema.js';

const CLAVE = 'agenda_contactos_v1';
let db = null;

const aBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const aBytes = (b64) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

export async function iniciarDB() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  let guardada = null;
  try { guardada = localStorage.getItem(CLAVE); }
  catch (e) { console.warn('Sin acceso a localStorage', e); }

  db = guardada
    ? new SQL.Database(aBytes(guardada))
    : new SQL.Database();

  db.run(ESQUEMA);
  persistir();
  return db;
}

export function obtenerDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de consultar.');
  return db;
}

export function persistir() {
  try { localStorage.setItem(CLAVE, aBase64(db.export())); }
  catch (e) { console.warn('No se pudo guardar la base', e); }
}
```

### Lectura guiada

1. `import wasmUrl from '...?url'` — Vite da la ruta pública del WASM
2. `initSqlJs` es asíncrono (descarga y compila WASM) → estado de carga al arrancar
3. Con bytes guardados se reconstruye la base; si no, nace vacía y el esquema la crea
4. `db.export()` = archivo `.db` completo en bytes
5. `localStorage` siempre en `try/catch` (modo incógnito puede fallar)

---

## 5. El repositorio CRUD

Todo el SQL vive aquí. Valores siempre como parámetros, nunca concatenados.

### `src/db/contactosRepo.js`

```js
import { obtenerDB, persistir } from './database.js';

export function listarContactos({ texto = '', categoria = 'Todas' } = {}) {
  const sql = `
    SELECT * FROM contactos
    WHERE (nombre LIKE $t OR apellido LIKE $t OR telefono LIKE $t)
      AND ($c = 'Todas' OR categoria = $c)
    ORDER BY favorito DESC, nombre COLLATE NOCASE ASC`;
  const stmt = obtenerDB().prepare(sql);
  stmt.bind({ '$t': `%${texto}%`, '$c': categoria });
  const filas = [];
  while (stmt.step()) filas.push(stmt.getAsObject());
  stmt.free();
  return filas;
}

export function crearContacto(c) {
  obtenerDB().run(
    `INSERT INTO contactos (nombre, apellido, telefono, email, categoria, favorito, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [c.nombre.trim(), c.apellido.trim(), c.telefono.trim(),
     c.email.trim(), c.categoria, c.favorito ? 1 : 0, c.notas.trim()]
  );
  persistir();
}

export function actualizarContacto(id, c) {
  obtenerDB().run(
    `UPDATE contactos
     SET nombre = ?, apellido = ?, telefono = ?, email = ?,
         categoria = ?, favorito = ?, notas = ?
     WHERE id = ?`,
    [c.nombre, c.apellido, c.telefono, c.email,
     c.categoria, c.favorito ? 1 : 0, c.notas, id]
  );
  persistir();
}

export function eliminarContacto(id) {
  obtenerDB().run('DELETE FROM contactos WHERE id = ?', [id]);
  persistir();
}

export function alternarFavorito(id) {
  obtenerDB().run(
    'UPDATE contactos SET favorito = CASE favorito WHEN 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  );
  persistir();
}

export function resumenPorCategoria() {
  const res = obtenerDB().exec(
    'SELECT categoria, COUNT(*) AS total FROM contactos GROUP BY categoria'
  );
  if (res.length === 0) return [];
  return res[0].values.map(([categoria, total]) => ({ categoria, total }));
}
```

### Parámetros, nunca concatenación

`"WHERE id = " + id` permitiría inyección (`1; DROP TABLE contactos`). Con `?` el motor trata el valor como dato, no como instrucción.

### Tres formas de consultar

| Método | Cuándo |
|--------|--------|
| `run()` | Sin filas: `INSERT`, `UPDATE`, `DELETE` |
| `prepare()` | Listados con filtros (`step()`) |
| `exec()` | Resumen de golpe (columnas + valores) |

---

## 6. WhatsApp, compartir y vCard

Prefijo Perú: `51`. `wa.me` exige número internacional sin signos ni espacios.

### `src/utils/contacto.js`

```js
const PREFIJO_PAIS = '51';

export function normalizarTelefono(telefono) {
  const digitos = String(telefono).replace(/\D/g, '');
  if (digitos.startsWith(PREFIJO_PAIS)) return digitos;
  return PREFIJO_PAIS + digitos.replace(/^0+/, '');
}

export function enlaceWhatsApp(telefono, mensaje = '') {
  const numero = normalizarTelefono(telefono);
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}${texto ? `?text=${texto}` : ''}`;
}

export async function compartirContacto(c) {
  const texto =
    `${c.nombre} ${c.apellido}\n` +
    `Telefono: +${normalizarTelefono(c.telefono)}\n` +
    (c.email ? `Correo: ${c.email}\n` : '');

  if (navigator.share) {
    try {
      await navigator.share({ title: c.nombre, text: texto });
      return 'compartido';
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelado';
    }
  }
  await navigator.clipboard.writeText(texto);
  return 'copiado';
}

export function descargarVCard(c) {
  const vcf = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${c.apellido};${c.nombre};;;`,
    `FN:${c.nombre} ${c.apellido}`,
    `TEL;TYPE=CELL:+${normalizarTelefono(c.telefono)}`,
    c.email ? `EMAIL:${c.email}` : null,
    `NOTE:${c.notas ?? ''}`,
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  const url = URL.createObjectURL(new Blob([vcf], { type: 'text/vcard' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${c.nombre}-${c.apellido}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### Detalles que suelen fallar

- `encodeURIComponent` obligatorio (tildes, `&`, saltos de línea)
- Nada de `+` ni `00` en `wa.me`: solo dígitos
- `navigator.share` solo en HTTPS/localhost; plan B = portapapeles
- `.vcf` usa CRLF (`\r\n`); con solo `\n` Android puede ignorarlo

---

## 7. El hook que sostiene el estado

Los componentes reciben la lista filtrada y acciones; no saben que existe SQLite.

### `src/hooks/useContactos.js`

```js
import { useState, useEffect, useCallback } from 'react';
import { iniciarDB } from '../db/database.js';
import * as repo from '../db/contactosRepo.js';

export function useContactos() {
  const [listos, setListos] = useState(false);
  const [contactos, setContactos] = useState([]);
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [error, setError] = useState('');

  const refrescar = useCallback(() => {
    setContactos(repo.listarContactos({ texto, categoria }));
  }, [texto, categoria]);

  useEffect(() => {
    iniciarDB().then(() => setListos(true));
  }, []);

  useEffect(() => {
    if (listos) refrescar();
  }, [listos, refrescar]);

  const ejecutar = (accion) => {
    try {
      accion();
      setError('');
      refrescar();
      return true;
    } catch (e) {
      setError(
        String(e.message).includes('UNIQUE')
          ? 'Ese numero ya esta registrado en la agenda.'
          : 'No se pudo guardar. Revisa los datos.'
      );
      return false;
    }
  };

  return {
    listos, contactos, texto, categoria, error,
    setTexto, setCategoria,
    crear: (c) => ejecutar(() => repo.crearContacto(c)),
    actualizar: (id, c) => ejecutar(() => repo.actualizarContacto(id, c)),
    eliminar: (id) => ejecutar(() => repo.eliminarContacto(id)),
    favorito: (id) => ejecutar(() => repo.alternarFavorito(id))
  };
}
```

`ejecutar` traduce el error `UNIQUE` de SQLite a un mensaje entendible. Un error técnico no debe llegar tal cual a la pantalla.

---

## 8. Componentes React

### `src/components/ContactoForm.jsx`

Formulario para crear y editar. Validación de nombre, teléfono y email. Categorías: Personal, Trabajo, SENATI, Familia.

### `src/components/ContactoCard.jsx`

Tarjeta con iniciales, favorito, WhatsApp, compartir, vCard, editar y eliminar.

*(El código completo está en el PDF y ya implementado en `src/` del proyecto.)*

---

## 9. Clases Tailwind usadas

| Clase | Qué hace |
|-------|----------|
| `flex items-start gap-3` | Fila, alineados arriba, separación |
| `grid gap-3 sm:grid-cols-2` | 1 col móvil; 2 desde 640px |
| `min-w-0 truncate` | Texto largo con puntos en flex |
| `rounded-xl shadow-sm` | Esquinas y sombra de tarjeta |
| `px-3 py-1.5 text-xs` | Botón secundario |
| `focus:ring-2 focus:ring-blue-500` | Foco teclado (accesibilidad) |
| `hover:bg-blue-700` | Hover |
| `bg-whatsapp` | Color definido en `tailwind.config.js` |

---

## 10. Ejercicios para entregar

### Nivel 1 — Dominar el CRUD

#### E1. Campo de cumpleaños
- Columna `cumple TEXT`, input `type="date"`, mostrar en tarjeta `dd/mm/aaaa`
- Guardar ISO (`2007-03-15`); convertir al formato peruano solo al mostrar
- **Entrega:** esquema, formulario y tarjeta

#### E2. Confirmar antes de borrar
- Componente `DialogoConfirmar` (props: `mensaje`, `onAceptar`, `onCancelar`)
- Prohibido `window.confirm`
- Estado con contacto pendiente; si es `null`, no renderizar
- **Entrega:** componente reutilizable

#### E3. Orden configurable
- Selector: nombre A–Z, más recientes, categoría
- Orden en el `ORDER BY` SQL, no con `.sort()` en JS
- Mapa opción → fragmento SQL autorizado (nombre de columna no va como `?`)
- **Entrega:** `listarContactos` recibe el criterio

#### E4. Pantalla vacía con dirección
- Dos estados: agenda vacía vs búsqueda sin resultados
- Cada uno con mensaje y acción propia
- **Entrega:** capturas de ambos

### Nivel 2 — SQL y datos

#### E5. Tabla de grupos
- Sustituir `categoria` por `grupos(id, nombre, color)` + `grupo_id` FK
- Usuario crea sus grupos
- `PRAGMA foreign_keys = ON;` al iniciar
- **Entrega:** esquema con FK y JOIN en listado

#### E6. Historial de mensajes
- Tabla `mensajes(id, contacto_id, texto, enviado_en)`
- Al abrir WhatsApp, registrar envío; mostrar último mensaje en tarjeta
- **Entrega:** consulta con `MAX(enviado_en)` por contacto

#### E7. Copia de seguridad
- Exportar: descarga `agenda.db` real
- Importar: reemplaza base previa confirmación
- Export: `new Blob([db.export()], { type:'application/octet-stream' })`
- Import: `arrayBuffer()` → `new SQL.Database(new Uint8Array(buffer))`
- **Entrega:** archivo abre en DB Browser for SQLite

#### E8. Panel de estadísticas
- Total, favoritos, reparto por categoría, contacto más antiguo
- Solo con `COUNT`, `GROUP BY`, `MIN` (no recorrer arrays)
- **Entrega:** `estadisticas.js` con consultas

### Nivel 3 — Producto terminado

#### E9. Plantillas de mensaje
- Tres plantillas editables (saludo, reunión, cobranza) con `{nombre}`
- Guardadas en la base; elegir antes de abrir WhatsApp
- **Entrega:** tabla `plantillas` + función de reemplazo

#### E10. Accesible y responsiva
- Solo teclado, foco visible, `aria-label` en iconos
- Sin desborde horizontal a 360px
- **Entrega:** Lighthouse Accesibilidad ≥ 90

### Retos con IA

#### E11. Detector de duplicados
- Distancia de Levenshtein; avisar similitud y ofrecer fusionar
- Normalizar: minúsculas, sin tildes
- Umbral típico ≈ 0.85
- **Entrega:** `similitud(a, b)` con pruebas

#### E12. Redacción asistida por LLM
- Botón «Sugerir mensaje»: 3 tonos (formal, cercano, breve)
- Usuario elige, edita, luego WhatsApp
- Pedir JSON `[{ tono, mensaje }]` y parsear con `try/catch`
- **Entrega:** prompt, estados carga/error, reflexión ética (media página)

---

## 11. Rúbrica de evaluación

| Criterio | Qué se evalúa | Puntos |
|----------|---------------|--------|
| Modelo de datos | Esquema, restricciones, FK | 4 |
| Consultas SQL | Parámetros; filtros/orden en DB | 4 |
| Arquitectura React | Repo, hook, componentes; sin lógica duplicada | 4 |
| Interfaz Tailwind | Responsiva 360px, vacíos, errores, foco | 3 |
| Integraciones | WhatsApp, compartir, vCard | 3 |
| Retos con IA | Duplicados + redacción; errores y ética | 2 |
| **Total** | | **20** |

### Cómo entregar

1. Repo GitHub con `README.md` (capturas, instalación, decisiones)
2. Commits descriptivos, uno por ejercicio
3. Archivo `agenda.db` de ejemplo (≥ 10 contactos)
4. Video de 3 minutos del flujo completo (incluido WhatsApp)
