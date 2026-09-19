/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import EstadoVacio from './EstadoVacio.jsx';

afterEach(() => cleanup());

describe('E4 estados vacios', () => {
  it('agenda vacia muestra accion al formulario', () => {
    const onAccion = vi.fn();
    render(<EstadoVacio tipo="agenda" onAccion={onAccion} />);
    expect(screen.getByText(/agenda esta vacia/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Ir al formulario/i }));
    expect(onAccion).toHaveBeenCalledTimes(1);
  });

  it('busqueda sin resultados limpia filtros', () => {
    const onAccion = vi.fn();
    render(<EstadoVacio tipo="busqueda" onAccion={onAccion} />);
    expect(screen.getByText(/No hay resultados/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Limpiar filtros/i }));
    expect(onAccion).toHaveBeenCalledTimes(1);
  });
});
