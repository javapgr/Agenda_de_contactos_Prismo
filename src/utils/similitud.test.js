import { describe, it, expect } from 'vitest';
import {
  similitud,
  buscarDuplicados,
  UMBRAL_SIMILITUD,
  normalizarTexto,
} from './similitud.js';

describe('E11 similitud / Levenshtein', () => {
  it('normaliza tildes y mayusculas', () => {
    expect(normalizarTexto('Ana Ríos')).toBe('ana rios');
  });

  it('detecta nombres casi iguales sobre el umbral', () => {
    const score = similitud('Ana Ríos', 'Ana Rios');
    expect(score).toBeGreaterThanOrEqual(UMBRAL_SIMILITUD);
  });

  it('rechaza nombres distintos', () => {
    expect(similitud('Ana Rios', 'Carlos Perez')).toBeLessThan(0.5);
  });

  it('busca duplicados por nombre o telefono', () => {
    const existentes = [
      { id: 1, nombre: 'Ana', apellido: 'Rios', telefono: '51965123456' },
      { id: 2, nombre: 'Luis', apellido: 'Mora', telefono: '51999999999' },
    ];
    const hits = buscarDuplicados(
      { nombre: 'Ana', apellido: 'Ríos', telefono: '965123456' },
      existentes
    );
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].contacto.id).toBe(1);
  });
});
