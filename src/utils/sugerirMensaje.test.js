import { describe, it, expect, vi } from 'vitest';
import { sugerenciasLocales, sugerirMensajes } from './sugerirMensaje.js';

describe('E12 sugerir mensaje', () => {
  const contacto = {
    nombre: 'Ana',
    grupo: 'Trabajo',
    notas: 'reunion lunes',
  };

  it('genera tres tonos en local', () => {
    const lista = sugerenciasLocales(contacto);
    expect(lista).toHaveLength(3);
    expect(lista.map((s) => s.tono)).toEqual(['formal', 'cercano', 'breve']);
    expect(lista[0].mensaje).toContain('Ana');
  });

  it('usa respaldo local si el LLM falla', async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error('red');
    });
    vi.stubEnv?.('VITE_LLM_URL', undefined);

    const res = await sugerirMensajes(contacto, { fetchFn });
    expect(res.sugerencias).toHaveLength(3);
    expect(res.fuente).toBe('local');
  });
});
