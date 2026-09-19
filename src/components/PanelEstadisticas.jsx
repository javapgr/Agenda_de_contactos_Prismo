import {
  totalContactos,
  totalFavoritos,
  repartoPorGrupo,
  contactoMasAntiguo,
} from '../db/estadisticas.js';
import { DonutGrupos, AnilloFavoritos } from './Graficos.jsx';

export default function PanelEstadisticas() {
  const total = totalContactos();
  const favoritos = totalFavoritos();
  const grupos = repartoPorGrupo();
  const antiguo = contactoMasAntiguo();

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{total}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Favoritos</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{favoritos}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:col-span-1">
          <p className="text-xs text-slate-500">Mas antiguo</p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {antiguo
              ? `${antiguo.nombre} ${antiguo.apellido}`
              : '—'}
          </p>
          {antiguo && (
            <p className="text-xs text-slate-400">{antiguo.creado_en}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Contactos por grupo
          </h3>
          <DonutGrupos datos={grupos} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Favoritos
          </h3>
          <AnilloFavoritos total={total} favoritos={favoritos} />
        </div>
      </div>
    </section>
  );
}
