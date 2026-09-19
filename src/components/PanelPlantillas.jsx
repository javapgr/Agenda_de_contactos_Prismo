import { useState } from 'react';

export default function PanelPlantillas({ plantillas, onGuardar }) {
  const [editando, setEditando] = useState({});

  const cuerpo = (p) =>
    editando[p.id] !== undefined ? editando[p.id] : p.cuerpo;

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Estas plantillas se usan al pulsar WhatsApp en un contacto. Variables:{' '}
        <code className="rounded bg-slate-100 px-1">{'{nombre}'}</code>{' '}
        (nombre completo),{' '}
        <code className="rounded bg-slate-100 px-1">{'{apellido}'}</code>,{' '}
        <code className="rounded bg-slate-100 px-1">{'{grupo}'}</code>,{' '}
        <code className="rounded bg-slate-100 px-1">{'{telefono}'}</code>
      </p>
      {plantillas.map((p) => (
        <div key={p.id} className="space-y-2 rounded-md border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">{p.nombre}</p>
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-lucid-blue"
            rows={3}
            value={cuerpo(p)}
            onChange={(e) =>
              setEditando((prev) => ({ ...prev, [p.id]: e.target.value }))
            }
            aria-label={`Plantilla ${p.nombre}`}
          />
          <button
            type="button"
            onClick={() => {
              onGuardar(p.id, cuerpo(p));
              setEditando((prev) => {
                const next = { ...prev };
                delete next[p.id];
                return next;
              });
            }}
            className="rounded-md bg-lucid-blue px-3 py-1.5 text-xs font-medium text-white hover:brightness-110"
          >
            Guardar plantilla
          </button>
        </div>
      ))}
    </div>
  );
}
