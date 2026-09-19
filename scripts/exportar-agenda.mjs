import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';
import { ESQUEMA, migrar, sembrarDemo } from '../src/db/esquema.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wasm = join(root, 'node_modules/sql.js/dist/sql-wasm.wasm');
const salida = join(root, 'agenda.db');

const SQL = await initSqlJs({ locateFile: () => wasm });
const db = new SQL.Database();
db.run('PRAGMA foreign_keys = ON');
db.run(ESQUEMA);
migrar(db);
sembrarDemo(db);

const bytes = db.export();
writeFileSync(salida, Buffer.from(bytes));
db.close();

const n = new SQL.Database(bytes).exec('SELECT COUNT(*) FROM contactos')[0].values[0][0];
console.log(`agenda.db listo (${n} contactos) -> ${salida}`);
