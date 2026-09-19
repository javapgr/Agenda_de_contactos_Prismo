import { obtenerDB, persistir } from './database.js';

const ORDEN_SQL = {
  nombre: 'c.favorito DESC, c.nombre COLLATE NOCASE ASC',
  recientes: 'c.creado_en DESC',
  categoria: 'g.nombre COLLATE NOCASE ASC, c.nombre COLLATE NOCASE ASC',
};

export function listarContactos({
  texto = '',
  grupoId = 0,
  orden = 'nombre',
} = {}) {
  const orderBy = ORDEN_SQL[orden] ?? ORDEN_SQL.nombre;
  const sql = `
    SELECT c.*,
           g.nombre AS grupo,
           g.color AS grupo_color,
           (SELECT MAX(m.enviado_en) FROM mensajes m WHERE m.contacto_id = c.id) AS ultimo_mensaje
    FROM contactos c
    JOIN grupos g ON g.id = c.grupo_id
    WHERE (c.nombre LIKE $t OR c.apellido LIKE $t OR c.telefono LIKE $t)
      AND ($g = 0 OR c.grupo_id = $g)
    ORDER BY ${orderBy}`;
  const stmt = obtenerDB().prepare(sql);
  stmt.bind({ $t: `%${texto}%`, $g: grupoId });
  const filas = [];
  while (stmt.step()) filas.push(stmt.getAsObject());
  stmt.free();
  return filas;
}

export function crearContacto(c) {
  obtenerDB().run(
    `INSERT INTO contactos (nombre, apellido, telefono, email, grupo_id, favorito, notas, cumple)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      c.nombre.trim(),
      c.apellido.trim(),
      c.telefono.trim(),
      (c.email || '').trim(),
      c.grupo_id,
      c.favorito ? 1 : 0,
      (c.notas || '').trim(),
      c.cumple || null,
    ]
  );
  persistir();
}

export function actualizarContacto(id, c) {
  obtenerDB().run(
    `UPDATE contactos
     SET nombre = ?, apellido = ?, telefono = ?, email = ?,
         grupo_id = ?, favorito = ?, notas = ?, cumple = ?
     WHERE id = ?`,
    [
      c.nombre,
      c.apellido,
      c.telefono,
      c.email,
      c.grupo_id,
      c.favorito ? 1 : 0,
      c.notas,
      c.cumple || null,
      id,
    ]
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

export function registrarMensaje(contactoId, texto) {
  obtenerDB().run(
    'INSERT INTO mensajes (contacto_id, texto) VALUES (?, ?)',
    [contactoId, texto]
  );
  persistir();
}

export function listarGrupos() {
  const res = obtenerDB().exec(
    'SELECT id, nombre, color FROM grupos ORDER BY nombre COLLATE NOCASE'
  );
  if (!res.length) return [];
  return res[0].values.map(([id, nombre, color]) => ({ id, nombre, color }));
}

export function crearGrupo(nombre, color = '#64748b') {
  const n = String(nombre || '').trim();
  if (!n) throw new Error('Escribe un nombre de grupo.');
  obtenerDB().run('INSERT INTO grupos (nombre, color) VALUES (?, ?)', [
    n,
    color,
  ]);
  persistir();
}

export function eliminarGrupo(id) {
  const db = obtenerDB();
  const grupos = listarGrupos();
  if (grupos.length <= 1) {
    throw new Error('Debe quedar al menos un grupo.');
  }
  const destino = grupos.find((g) => g.id !== id);
  if (!destino) throw new Error('No hay grupo destino.');
  db.run('UPDATE contactos SET grupo_id = ? WHERE grupo_id = ?', [
    destino.id,
    id,
  ]);
  db.run('DELETE FROM grupos WHERE id = ?', [id]);
  persistir();
  return destino;
}

export function listarPlantillas() {
  const res = obtenerDB().exec(
    'SELECT id, nombre, cuerpo FROM plantillas ORDER BY id'
  );
  if (!res.length) return [];
  return res[0].values.map(([id, nombre, cuerpo]) => ({ id, nombre, cuerpo }));
}

export function actualizarPlantilla(id, cuerpo) {
  obtenerDB().run('UPDATE plantillas SET cuerpo = ? WHERE id = ?', [
    cuerpo.trim(),
    id,
  ]);
  persistir();
}
