import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { ESQUEMA, migrar, sembrarDemo } from './esquema.js';

const CLAVE_LEGACY = 'agenda_contactos_v4';
let SQL = null;
let db = null;
let claveActual = null;

const aBase64 = (bytes) => {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
};
const aBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export function claveAgenda(email) {
  const e = String(email || '')
    .trim()
    .toLowerCase();
  if (!e) throw new Error('Email de usuario requerido para la agenda.');
  return `agenda_prismo_v5_${e}`;
}

export function esUsuarioDemo(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
    .startsWith('danilo@');
}

function preparar(instancia) {
  instancia.run('PRAGMA foreign_keys = ON');
  instancia.run(ESQUEMA);
  migrar(instancia);
  return instancia;
}

async function cargarSQL(locate) {
  SQL = await initSqlJs(locate ? { locateFile: () => wasmUrl } : undefined);
  return SQL;
}

function leerGuardada(clave) {
  try {
    return localStorage.getItem(clave);
  } catch (e) {
    console.warn('Sin acceso a localStorage', e);
    return null;
  }
}

export async function iniciarDB({ email } = {}) {
  await cargarSQL(true);
  if (db) {
    try {
      db.close();
    } catch (_) {
      /* ignore */
    }
    db = null;
  }

  claveActual = claveAgenda(email);
  let guardada = leerGuardada(claveActual);

  if (!guardada && esUsuarioDemo(email)) {
    const legacy = leerGuardada(CLAVE_LEGACY);
    if (legacy) {
      guardada = legacy;
      try {
        localStorage.setItem(claveActual, legacy);
      } catch (_) {
        /* ignore */
      }
    }
  }

  db = preparar(guardada ? new SQL.Database(aBytes(guardada)) : new SQL.Database());
  if (esUsuarioDemo(email)) sembrarDemo(db);
  persistir();
  return db;
}

export async function iniciarDBMemoria() {
  await cargarSQL(false);
  claveActual = null;
  db = preparar(new SQL.Database());
  return db;
}

export function obtenerDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de consultar.');
  return db;
}

export function persistir() {
  if (!db || !claveActual) return;
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(claveActual, aBase64(db.export()));
  } catch (e) {
    console.warn('No se pudo guardar la base', e);
  }
}

export function exportarBytes() {
  return obtenerDB().export();
}

export function importarBytes(bytes) {
  if (!SQL) throw new Error('SQL no inicializado');
  if (db) db.close();
  db = preparar(new SQL.Database(new Uint8Array(bytes)));
  persistir();
  return db;
}

export function cerrarDB() {
  if (db) {
    try {
      db.close();
    } catch (_) {
      /* ignore */
    }
    db = null;
  }
  claveActual = null;
}
