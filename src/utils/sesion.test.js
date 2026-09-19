/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  crearUsuario,
  iniciarSesion,
  leerSesion,
  cerrarSesion,
  inicialesDe,
} from './sesion.js';

describe('sesion local', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('crea usuario y deja sesion activa', () => {
    const u = crearUsuario({ nombre: 'Ana', email: 'ana@mail.com' });
    expect(u.email).toBe('ana@mail.com');
    expect(leerSesion().nombre).toBe('Ana');
  });

  it('inicia sesion con email registrado', () => {
    crearUsuario({ nombre: 'Ana', email: 'ana@mail.com' });
    cerrarSesion();
    expect(leerSesion()).toBeNull();
    const u = iniciarSesion({ email: 'ana@mail.com' });
    expect(u.nombre).toBe('Ana');
  });

  it('rechaza email duplicado al crear', () => {
    crearUsuario({ nombre: 'Ana', email: 'ana@mail.com' });
    expect(() =>
      crearUsuario({ nombre: 'Otra', email: 'ana@mail.com' })
    ).toThrow(/ya esta registrado/);
  });

  it('arma iniciales', () => {
    expect(inicialesDe('Ana Rios')).toBe('AR');
  });
});
