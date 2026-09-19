export const ESQUEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS grupos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#64748b'
);

CREATE TABLE IF NOT EXISTS contactos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL DEFAULT '',
  telefono TEXT NOT NULL UNIQUE,
  email TEXT,
  grupo_id INTEGER NOT NULL REFERENCES grupos(id),
  favorito INTEGER NOT NULL DEFAULT 0 CHECK (favorito IN (0,1)),
  notas TEXT,
  cumple TEXT,
  creado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_contactos_nombre ON contactos(nombre);

CREATE TABLE IF NOT EXISTS mensajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contacto_id INTEGER NOT NULL REFERENCES contactos(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  enviado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS plantillas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  cuerpo TEXT NOT NULL
);
`;

const GRUPOS_BASE = [
  ['Personal', '#3b82f6'],
  ['Trabajo', '#0f766e'],
  ['SENATI', '#ea580c'],
  ['Familia', '#db2777'],
];

const PLANTILLAS_BASE = [
  ['Saludo', 'Hola {nombre}, te escribo desde mi agenda de contactos.'],
  ['Recordatorio de reunion', 'Hola {nombre}, te recuerdo nuestra reunion. Confirmame si puedes asistir.'],
  ['Cobranza', 'Hola {nombre}, te escribo para recordarte el pago pendiente. Quedo atento.'],
];

export function migrar(db) {
  db.run('PRAGMA foreign_keys = ON');

  const tablas = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='grupos'"
  );
  if (!tablas.length) {
    db.run(ESQUEMA);
  }

  const info = db.exec('PRAGMA table_info(contactos)');
  const cols = info[0] ? info[0].values.map((fila) => fila[1]) : [];

  if (cols.includes('categoria') && !cols.includes('grupo_id')) {
    sembrarGrupos(db);
    db.run('ALTER TABLE contactos ADD COLUMN grupo_id INTEGER');
    db.run(`
      UPDATE contactos
      SET grupo_id = (
        SELECT id FROM grupos WHERE grupos.nombre = contactos.categoria
      )
    `);
    db.run(`
      UPDATE contactos
      SET grupo_id = (SELECT id FROM grupos WHERE nombre = 'Personal' LIMIT 1)
      WHERE grupo_id IS NULL
    `);
  }

  if (!cols.includes('cumple') && cols.length) {
    try {
      db.run('ALTER TABLE contactos ADD COLUMN cumple TEXT');
    } catch (_) {
      /* ya existe en esquemas nuevos */
    }
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS plantillas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      cuerpo TEXT NOT NULL
    )
  `);

  sembrarGrupos(db);
  sembrarPlantillas(db);
}

export function sembrarGrupos(db) {
  const res = db.exec('SELECT COUNT(*) FROM grupos');
  const total = res[0]?.values[0][0] ?? 0;
  if (total > 0) return;
  for (const [nombre, color] of GRUPOS_BASE) {
    db.run('INSERT INTO grupos (nombre, color) VALUES (?, ?)', [nombre, color]);
  }
}

export function sembrarPlantillas(db) {
  const res = db.exec('SELECT COUNT(*) FROM plantillas');
  const total = res[0]?.values[0][0] ?? 0;
  if (total > 0) return;
  for (const [nombre, cuerpo] of PLANTILLAS_BASE) {
    db.run('INSERT INTO plantillas (nombre, cuerpo) VALUES (?, ?)', [nombre, cuerpo]);
  }
}

function idGrupo(db, nombre) {
  const stmt = db.prepare('SELECT id FROM grupos WHERE nombre = ?');
  stmt.bind([nombre]);
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id;
}

const DEMO = [
  ['Ana', 'Rios', '965111001', 'ana@mail.com', 'Personal', 1, '2001-03-15'],
  ['Luis', 'Perez', '965111002', 'luis@mail.com', 'Trabajo', 0, '1998-07-22'],
  ['Maria', 'Lopez', '965111003', 'maria@mail.com', 'Familia', 1, '2000-11-02'],
  ['Carlos', 'Diaz', '965111004', 'carlos@mail.com', 'SENATI', 0, '1999-01-18'],
  ['Elena', 'Vargas', '965111005', 'elena@mail.com', 'Trabajo', 0, '1997-05-09'],
  ['Pedro', 'Soto', '965111006', 'pedro@mail.com', 'Personal', 1, '2002-09-30'],
  ['Lucia', 'Mora', '965111007', 'lucia@mail.com', 'Familia', 0, '1995-12-12'],
  ['Jorge', 'Cruz', '965111008', 'jorge@mail.com', 'SENATI', 0, '2001-04-04'],
  ['Sofia', 'Reyes', '965111009', 'sofia@mail.com', 'Trabajo', 1, '1996-08-21'],
  ['Diego', 'Nunez', '965111010', 'diego@mail.com', 'Personal', 0, '2003-02-14'],
];

export function sembrarDemo(db) {
  const res = db.exec('SELECT COUNT(*) FROM contactos');
  const total = res[0]?.values[0][0] ?? 0;
  if (total > 0) return;

  for (const [nombre, apellido, telefono, email, grupo, favorito, cumple] of DEMO) {
    const gid = idGrupo(db, grupo);
    const stmt = db.prepare(
      `INSERT INTO contactos (nombre, apellido, telefono, email, grupo_id, favorito, notas, cumple)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run([
      nombre,
      apellido,
      telefono,
      email,
      gid,
      favorito ? 1 : 0,
      '',
      cumple,
    ]);
    stmt.free();
  }
}
