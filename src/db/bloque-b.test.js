import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  iniciarDBMemoria,
  cerrarDB,
  exportarBytes,
  importarBytes,
  obtenerDB,
} from './database.js';
import { crearContacto, listarContactos, crearGrupo, listarGrupos, registrarMensaje, eliminarGrupo } from './contactosRepo.js';
import {
  totalContactos,
  totalFavoritos,
  repartoPorGrupo,
  contactoMasAntiguo,
} from './estadisticas.js';

function idGrupo(nombre) {
  const stmt = obtenerDB().prepare('SELECT id FROM grupos WHERE nombre = ?');
  stmt.bind([nombre]);
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id;
}

function contacto(parcial = {}) {
  return {
    nombre: 'Ana',
    apellido: 'Rios',
    telefono: '965111222',
    email: '',
    grupo_id: idGrupo('Personal'),
    favorito: true,
    notas: '',
    cumple: '',
    ...parcial,
  };
}

describe('Bloque B', () => {
  beforeEach(async () => {
    await iniciarDBMemoria();
  });

  afterEach(() => cerrarDB());

  it('E7 exporta e importa agenda.db', () => {
    crearContacto(contacto());
    const bytes = exportarBytes();
    expect(bytes.byteLength).toBeGreaterThan(0);

    crearContacto(contacto({ nombre: 'Otro', telefono: '999888777' }));
    expect(listarContactos()).toHaveLength(2);

    importarBytes(bytes);
    const lista = listarContactos();
    expect(lista).toHaveLength(1);
    expect(lista[0].nombre).toBe('Ana');
  });

  it('E5 tiene grupos, FK y JOIN', () => {
    const fk = obtenerDB().exec('PRAGMA foreign_keys');
    expect(fk[0].values[0][0]).toBe(1);

    crearGrupo('Amigos', '#111111');
    const grupos = listarGrupos();
    expect(grupos.some((g) => g.nombre === 'Amigos')).toBe(true);

    const amigos = grupos.find((g) => g.nombre === 'Amigos');
    crearContacto(contacto({ telefono: '911111111', grupo_id: amigos.id }));
    const [c] = listarContactos({ grupoId: amigos.id });
    expect(c.grupo).toBe('Amigos');
    expect(c.grupo_color).toBe('#111111');
  });

  it('elimina grupo y mueve contactos', () => {
    crearGrupo('Temporal', '#000000');
    const temporal = listarGrupos().find((g) => g.nombre === 'Temporal');
    crearContacto(contacto({ telefono: '955555555', grupo_id: temporal.id }));
    eliminarGrupo(temporal.id);
    expect(listarGrupos().some((g) => g.nombre === 'Temporal')).toBe(false);
    const [c] = listarContactos({ texto: '955555555' });
    expect(c.grupo).not.toBe('Temporal');
  });

  it('E6 registra mensajes y expone ultimo envio', () => {
    crearContacto(contacto({ telefono: '922222222' }));
    const [c] = listarContactos();
    registrarMensaje(c.id, 'Hola Ana');
    const [u] = listarContactos();
    expect(u.ultimo_mensaje).toBeTruthy();
  });

  it('E8 estadisticas solo con SQL', () => {
    crearContacto(contacto({ telefono: '933333333', favorito: true }));
    crearContacto(
      contacto({ nombre: 'Bea', telefono: '944444444', favorito: false, grupo_id: idGrupo('Trabajo') })
    );

    expect(totalContactos()).toBe(2);
    expect(totalFavoritos()).toBe(1);
    const reparto = repartoPorGrupo();
    expect(reparto.find((r) => r.grupo === 'Personal').total).toBe(1);
    expect(reparto.find((r) => r.grupo === 'Trabajo').total).toBe(1);
    expect(reparto.find((r) => r.grupo === 'Personal').color).toBeTruthy();
    expect(contactoMasAntiguo()).toBeTruthy();
  });
});
