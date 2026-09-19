/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DialogoConfirmar from './DialogoConfirmar.jsx';

afterEach(() => cleanup());

describe('E2 DialogoConfirmar', () => {
  it('muestra el mensaje', () => {
    render(
      <DialogoConfirmar
        mensaje="Eliminar a Ana Rios?"
        onAceptar={() => {}}
        onCancelar={() => {}}
      />
    );
    expect(screen.getByText('Eliminar a Ana Rios?')).toBeTruthy();
  });

  it('llama onAceptar al confirmar', () => {
    const onAceptar = vi.fn();
    render(
      <DialogoConfirmar
        mensaje="Eliminar?"
        etiquetaAceptar="Eliminar"
        onAceptar={onAceptar}
        onCancelar={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onAceptar).toHaveBeenCalledTimes(1);
  });

  it('llama onCancelar al cancelar', () => {
    const onCancelar = vi.fn();
    render(
      <DialogoConfirmar
        mensaje="Eliminar?"
        onAceptar={() => {}}
        onCancelar={onCancelar}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
});
