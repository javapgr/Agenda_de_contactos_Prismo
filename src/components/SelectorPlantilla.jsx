import { useState, useEffect } from 'react';
import { enlaceWhatsApp } from '../utils/contacto.js';
import { aplicarPlantilla, varsContacto } from '../utils/plantilla.js';
import { sugerirMensajes } from '../utils/sugerirMensaje.js';

export default function SelectorPlantilla({
  contacto,
  plantillas,
  onEnviar,
  onGuardarPlantilla,
  onCancelar,
}) {
  const [activa, setActiva] = useState(plantillas[0]?.id ?? null);
  const [borrador, setBorrador] = useState(plantillas[0]?.cuerpo ?? '');
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorSug, setErrorSug] = useState('');
  const vars = varsContacto(contacto);

  useEffect(() => {
    const p = plantillas.find((x) => x.id === activa) ?? plantillas[0];
    if (p) {
      setActiva(p.id);
      setBorrador(p.cuerpo);
    }
  }, [plantillas, activa]);

  const mensaje = aplicarPlantilla(borrador, vars);

  const enviar = () => {
    onEnviar(mensaje);
    window.open(enlaceWhatsApp(contacto.telefono, mensaje), '_blank', 'noopener,noreferrer');
  };

  const sugerir = async () => {
    setCargando(true);
    setErrorSug('');
    try {
      const res = await sugerirMensajes(contacto);
      if (res.error) setErrorSug(`Modelo no disponible (${res.error}). Usando respaldo local.`);
      setSugerencias(res.sugerencias);
    } catch (e) {
      setErrorSug('No se pudo sugerir mensajes.');
      setSugerencias([]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-plantilla"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancelar();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-xl bg-white p-4 shadow-lg">
        <h2 id="titulo-plantilla" className="text-base font-semibold">
          Mensaje para {vars.nombre}
        </h2>
        <p className="text-xs text-slate-500">
          {[vars.telefono, vars.grupo].filter(Boolean).join(' · ')}
        </p>
        <label className="block text-xs text-slate-500" htmlFor="sel-plantilla">
          Plantilla
        </label>
        <select
          id="sel-plantilla"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          value={activa ?? ''}
          onChange={(e) => {
            const id = Number(e.target.value);
            setActiva(id);
            const p = plantillas.find((x) => x.id === id);
            if (p) setBorrador(p.cuerpo);
          }}
        >
          {plantillas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <label className="block text-xs text-slate-500" htmlFor="cuerpo-plantilla">
          Texto (usa {'{nombre}'})
        </label>
        <textarea
          id="cuerpo-plantilla"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          rows={4}
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
        />
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Vista previa: {mensaje}
        </p>

        <button
          type="button"
          onClick={sugerir}
          disabled={cargando}
          className="rounded-lg border px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
        >
          {cargando ? 'Sugiriendo...' : 'Sugerir mensaje'}
        </button>
        {errorSug && (
          <p role="alert" className="text-xs text-amber-700">
            {errorSug}
          </p>
        )}
        {sugerencias.length > 0 && (
          <ul className="space-y-2">
            {sugerencias.map((s) => (
              <li key={s.tono}>
                <button
                  type="button"
                  onClick={() => setBorrador(s.mensaje)}
                  className="w-full rounded-lg border px-3 py-2 text-left text-xs hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="font-semibold capitalize">{s.tono}</span>
                  <span className="mt-1 block text-slate-600">{s.mensaje}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onGuardarPlantilla(activa, borrador)}
            className="rounded-lg border px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Guardar plantilla
          </button>
          <button
            type="button"
            onClick={enviar}
            className="rounded-lg bg-whatsapp px-4 py-2 text-sm font-medium text-white focus-visible:ring-2 focus-visible:ring-green-600"
          >
            Abrir WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
