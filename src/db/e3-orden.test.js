import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { iniciarDBMemoria, cerrarDB, obtenerDB } from './database.js';
import { crearContacto, listarContactos } from './contactosRepo.js';

function idGrupo(nombre) {
  const stmt = obtenerDB().prepare('SELECT id FROM grupos WHERE nombre = ?');
  stmt.bind([nombre]);
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id;
}

function contacto(parcial) {
  return {
    nombre: 'X',
    apellido: '',
    telefono: String(Math.floor(Math.random() * 1e9)),
    email: '',
    grupo_id: idGrupo('Personal'),
    favorito: false,
    notas: '',
    cumple: '',
    ...parcial,
  };
}

describe('E3 orden configurable', () => {
  beforeEach(async () => {
    await iniciarDBMemoria();
    crearContacto(
      contacto({ nombre: 'Carlos', telefono: '111111111', grupo_id: idGrupo('Trabajo') })
    );
    crearContacto(
      contacto({ nombre: 'Ana', telefono: '222222222', grupo_id: idGrupo('Familia') })
    );
    crearContacto(
      contacto({ nombre: 'Bea', telefono: '333333333', grupo_id: idGrupo('SENATI') })
    );
  });

  afterEach(() => cerrarDB());

  it('ordena por nombre A-Z', () => {
    const lista = listarContactos({ orden: 'nombre' });
    expect(lista.map((c) => c.nombre)).toEqual(['Ana', 'Bea', 'Carlos']);
  });

  it('ordena por grupo', () => {
    const lista = listarContactos({ orden: 'categoria' });
    expect(lista.map((c) => c.grupo)).toEqual(['Familia', 'SENATI', 'Trabajo']);
  });

  it('ignora orden no autorizado y usa nombre', () => {
    const lista = listarContactos({ orden: 'DROP TABLE;--' });
    expect(lista.map((c) => c.nombre)).toEqual(['Ana', 'Bea', 'Carlos']);
  });
});
