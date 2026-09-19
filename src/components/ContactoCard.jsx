import {
  compartirContacto,
  descargarVCard,
} from '../utils/contacto.js';
import { formatearCumple } from '../utils/fecha.js';

export default function ContactoCard({
  c,
  onEditar,
  onEliminar,
  onFavorito,
  onWhatsApp,
}) {
  const iniciales = (c.nombre[0] + (c.apellido[0] ?? '')).toUpperCase();
  const cumpleTxt = formatearCumple(c.cumple);

  return (
    <article className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 font-semibold text-blue-700"
          aria-hidden="true"
        >
          {iniciales}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">
            {c.nombre} {c.apellido}
          </h3>
          <p className="text-sm text-slate-500">{c.telefono}</p>
          {cumpleTxt && (
            <p className="text-sm text-slate-500">Cumple: {cumpleTxt}</p>
          )}
          {c.ultimo_mensaje && (
            <p className="text-xs text-slate-400">
              Ultimo WhatsApp: {c.ultimo_mensaje}
            </p>
          )}
          <span
            className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs text-white"
            style={{ backgroundColor: c.grupo_color || '#64748b' }}
          >
            {c.grupo}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onFavorito(c.id)}
          aria-label={c.favorito ? 'Quitar de favoritos' : 'Marcar favorito'}
          className={`focus-visible:ring-2 focus-visible:ring-blue-500 ${
            c.favorito ? 'text-amber-500' : 'text-slate-300'
          }`}
        >
          ★
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onWhatsApp?.(c)}
          className="rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-medium text-white focus-visible:ring-2 focus-visible:ring-green-600"
        >
          Escribir por WhatsApp
        </button>
        <button
          type="button"
          onClick={() => compartirContacto(c)}
          className="rounded-lg border px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Compartir
        </button>
        <button
          type="button"
          onClick={() => descargarVCard(c)}
          className="rounded-lg border px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Descargar .vcf
        </button>
        <button
          type="button"
          onClick={() => onEditar(c)}
          className="rounded-lg border px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onEliminar(c.id)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
