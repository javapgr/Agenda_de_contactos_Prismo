import { describe, it, expect } from 'vitest';
import { formatearCumple } from './fecha.js';

describe('formatearCumple', () => {
  it('convierte ISO a dd/mm/aaaa', () => {
    expect(formatearCumple('2007-03-15')).toBe('15/03/2007');
  });

  it('devuelve vacio si no hay fecha', () => {
    expect(formatearCumple('')).toBe('');
    expect(formatearCumple(null)).toBe('');
    expect(formatearCumple(undefined)).toBe('');
  });
});
