import { useState } from 'react';
import { MARCA } from '../brand.js';
import { crearUsuario, iniciarSesion } from '../utils/sesion.js';

export default function PantallaSesion({
  onEntrar,
  onVolver,
  modoInicial = 'entrar',
}) {
  const [modo, setModo] = useState(modoInicial);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    setError('');
    try {
      const u =
        modo === 'crear'
          ? crearUsuario({ nombre, email })
          : iniciarSesion({ email });
      onEntrar(u);
    } catch (err) {
      setError(err.message || 'No se pudo continuar.');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#0b1220] px-4 font-sans">
      <div className="w-full max-w-sm space-y-5 rounded-xl border border-white/10 bg-[#121a2b] p-6 text-slate-100 shadow-xl">
        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            className="text-xs text-slate-400 hover:text-white"
          >
            ← Volver
          </button>
        )}
        <div className="space-y-1 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight text-white">
            {MARCA.nombre}
          </p>
          <p className="text-sm text-slate-400">{MARCA.eslogan}</p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-lg bg-black/30 p-1">
          <button
            type="button"
            onClick={() => {
              setModo('entrar');
              setError('');
            }}
            className={`rounded-md px-3 py-2 text-sm ${
              modo === 'entrar'
                ? 'bg-white font-medium text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            onClick={() => {
              setModo('crear');
              setError('');
            }}
            className={`rounded-md px-3 py-2 text-sm ${
              modo === 'crear'
                ? 'bg-white font-medium text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear usuario
          </button>
        </div>

        <form className="space-y-3" onSubmit={enviar}>
          {modo === 'crear' && (
            <div>
              <label className="mb-1 block text-xs text-slate-400" htmlFor="sesion-nombre">
                Nombre
              </label>
              <input
                id="sesion-nombre"
                className="w-full rounded-md border border-white/15 bg-[#0b1220] px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lucid-blue"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs text-slate-400" htmlFor="sesion-email">
              Email
            </label>
            <input
              id="sesion-email"
              type="email"
              className="w-full rounded-md border border-white/15 bg-[#0b1220] px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lucid-blue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-amber-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-lucid-blue px-3 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            {modo === 'crear' ? 'Crear y entrar' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Sesion local en este navegador.
        </p>
      </div>
    </div>
  );
}
