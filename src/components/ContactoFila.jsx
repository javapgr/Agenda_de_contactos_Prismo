import { compartirContacto, descargarVCard } from '../utils/contacto.js';
import { IconStar } from './Icons.jsx';

function esFavorito(valor) {
  return Number(valor) === 1;
}

export default function ContactoFila({
  c,
  onEditar,
  onEliminar,
  onFavorito,
  onWhatsApp,
}) {
  const fav = esFavorito(c.favorito);

  return (
    <div className="border-b border-slate-200 hover:bg-[#f8f9fa]">
      <div className="grid grid-cols-[minmax(0,1fr)_8rem_6.5rem_auto] items-center gap-2 px-1 py-3 text-[13px]">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onFavorito(c.id)}
            aria-label={fav ? 'Quitar de favoritos' : 'Marcar favorito'}
            className={`shrink-0 focus-visible:ring-2 focus-visible:ring-lucid-blue ${
              fav ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            <IconStar className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEditar(c)}
            className="min-w-0 truncate text-left font-medium text-slate-900 hover:text-lucid-blue"
          >
            {c.nombre} {c.apellido}
          </button>
        </div>
        <span className="truncate text-slate-500">{c.telefono}</span>
        <span className="truncate text-slate-500">{c.grupo}</span>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          <button
            type="button"
            onClick={() => onWhatsApp?.(c)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => compartirContacto(c)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
          >
            Compartir
          </button>
          <button
            type="button"
            onClick={() => descargarVCard(c)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
          >
            .vcf
          </button>
          <button
            type="button"
            onClick={() => onEditar(c)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(c)}
            className="rounded border border-red-100 bg-white px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
