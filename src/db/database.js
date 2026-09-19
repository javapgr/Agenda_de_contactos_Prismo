import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { ESQUEMA, migrar, sembrarDemo } from './esquema.js';

const CLAVE = 'agenda_contactos_v4';
let SQL = null;
let db = null;

const aBase64 = (bytes) => {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
};
const aBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

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

export async function iniciarDB() {
  await cargarSQL(true);
  let guardada = null;
  try {
    guardada = localStorage.getItem(CLAVE);
  } catch (e) {
    console.warn('Sin acceso a localStorage', e);
  }
  db = preparar(guardada ? new SQL.Database(aBytes(guardada)) : new SQL.Database());
  sembrarDemo(db);
  persistir();
  return db;
}

export async function iniciarDBMemoria() {
  await cargarSQL(false);
  db = preparar(new SQL.Database());
  return db;
}

export function obtenerDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de consultar.');
  return db;
}

export function persistir() {
  if (!db) return;
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CLAVE, aBase64(db.export()));
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
    db.close();
    db = null;
  }
}
