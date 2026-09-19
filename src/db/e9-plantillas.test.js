import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { iniciarDBMemoria, cerrarDB } from '../db/database.js';
import {
  listarPlantillas,
  actualizarPlantilla,
} from '../db/contactosRepo.js';
import { aplicarPlantilla, varsContacto } from '../utils/plantilla.js';

describe('E9 plantillas', () => {
  beforeEach(async () => {
    await iniciarDBMemoria();
  });

  afterEach(() => cerrarDB());

  it('siembra tres plantillas editables', () => {
    const lista = listarPlantillas();
    expect(lista).toHaveLength(3);
    expect(lista.map((p) => p.nombre)).toEqual([
      'Saludo',
      'Recordatorio de reunion',
      'Cobranza',
    ]);
  });

  it('reemplaza {nombre} en el cuerpo', () => {
    expect(aplicarPlantilla('Hola {nombre}', { nombre: 'Ana' })).toBe('Hola Ana');
  });

  it('captura nombre completo del contacto', () => {
    const vars = varsContacto({
      nombre: 'jeapolin',
      apellido: 'fernades',
      grupo: 'Familia',
      telefono: '952971534',
    });
    expect(vars.nombre).toBe('jeapolin fernades');
    expect(
      aplicarPlantilla('Hola {nombre} ({grupo})', vars)
    ).toBe('Hola jeapolin fernades (Familia)');
  });

  it('actualiza el cuerpo de una plantilla', () => {
    const [p] = listarPlantillas();
    actualizarPlantilla(p.id, 'Hola {nombre}, nuevo texto');
    const actualizada = listarPlantillas().find((x) => x.id === p.id);
    expect(actualizada.cuerpo).toBe('Hola {nombre}, nuevo texto');
  });
});
