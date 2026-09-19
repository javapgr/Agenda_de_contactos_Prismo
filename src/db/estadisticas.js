import { obtenerDB } from './database.js';

function valor(sql) {
  const res = obtenerDB().exec(sql);
  if (!res.length) return 0;
  return res[0].values[0][0];
}

export function totalContactos() {
  return valor('SELECT COUNT(*) FROM contactos');
}

export function totalFavoritos() {
  return valor('SELECT COUNT(*) FROM contactos WHERE favorito = 1');
}

export function repartoPorGrupo() {
  const res = obtenerDB().exec(`
    SELECT g.nombre, g.color, COUNT(c.id) AS total
    FROM grupos g
    LEFT JOIN contactos c ON c.grupo_id = g.id
    GROUP BY g.id, g.nombre, g.color
    ORDER BY g.nombre COLLATE NOCASE
  `);
  if (!res.length) return [];
  return res[0].values.map(([grupo, color, total]) => ({
    grupo,
    color,
    total,
  }));
}

export function contactoMasAntiguo() {
  const res = obtenerDB().exec(`
    SELECT nombre, apellido, creado_en
    FROM contactos
    WHERE creado_en = (SELECT MIN(creado_en) FROM contactos)
    LIMIT 1
  `);
  if (!res.length) return null;
  const [nombre, apellido, creado_en] = res[0].values[0];
  return { nombre, apellido, creado_en };
}
