import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { iniciarDBMemoria, cerrarDB, obtenerDB } from './database.js';
import { crearContacto, actualizarContacto, listarContactos } from './contactosRepo.js';

function personalId() {
  const res = obtenerDB().exec("SELECT id FROM grupos WHERE nombre = 'Personal'");
  return res[0].values[0][0];
}

const base = () => ({
  nombre: 'Ana',
  apellido: 'Rios',
  telefono: '965123456',
  email: 'ana@mail.com',
  grupo_id: personalId(),
  favorito: false,
  notas: '',
  cumple: '2007-03-15',
});

describe('E1 cumpleanos en SQLite', () => {
  beforeEach(async () => {
    await iniciarDBMemoria();
  });

  afterEach(() => {
    cerrarDB();
  });

  it('tiene columna cumple en el esquema', () => {
    const info = obtenerDB().exec('PRAGMA table_info(contactos)');
    const cols = info[0].values.map((f) => f[1]);
    expect(cols).toContain('cumple');
  });

  it('guarda cumple en ISO al crear', () => {
    crearContacto(base());
    const [c] = listarContactos();
    expect(c.cumple).toBe('2007-03-15');
  });

  it('actualiza cumple', () => {
    crearContacto(base());
    const [c] = listarContactos();
    actualizarContacto(c.id, { ...base(), cumple: '1999-12-01' });
    const [u] = listarContactos();
    expect(u.cumple).toBe('1999-12-01');
  });
});
