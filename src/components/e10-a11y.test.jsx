/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ContactoCard from './ContactoCard.jsx';

afterEach(() => cleanup());

describe('E10 accesibilidad basica', () => {
  it('boton favorito tiene aria-label', () => {
    render(
      <ContactoCard
        c={{
          id: 1,
          nombre: 'Ana',
          apellido: 'Rios',
          telefono: '965123456',
          grupo: 'Personal',
          grupo_color: '#3b82f6',
          favorito: 0,
        }}
        onEditar={() => {}}
        onEliminar={() => {}}
        onFavorito={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /Marcar favorito/i })).toBeTruthy();
  });

  it('acciones principales son botones con texto visible', () => {
    render(
      <ContactoCard
        c={{
          id: 1,
          nombre: 'Ana',
          apellido: 'Rios',
          telefono: '965123456',
          grupo: 'Personal',
          favorito: 1,
        }}
        onEditar={() => {}}
        onEliminar={() => {}}
        onFavorito={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /WhatsApp/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Editar/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Eliminar/i })).toBeTruthy();
  });
});
