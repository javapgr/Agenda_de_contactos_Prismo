import {
  totalContactos,
  totalFavoritos,
  repartoPorGrupo,
} from '../db/estadisticas.js';
import {
  IconContacts,
  IconStats,
  IconGrid,
  IconPuzzle,
  IconFolder,
} from './Icons.jsx';

const MODULOS = [
  {
    id: 'contactos',
    titulo: 'Contactos',
    desc: 'CRUD, busqueda, favoritos y grupos',
    icon: IconContacts,
  },
  {
    id: 'stats',
    titulo: 'Estadisticas',
    desc: 'Totales SQL y graficos',
    icon: IconStats,
  },
  {
    id: 'plantillas',
    titulo: 'Plantillas',
    desc: 'Mensajes WhatsApp con {nombre}',
    icon: IconGrid,
  },
  {
    id: 'respaldo',
    titulo: 'Respaldo',
    desc: 'Exportar / importar agenda.db',
    icon: IconPuzzle,
  },
];

const HITOS = [
  'Modelo SQLite (grupos, mensajes, plantillas)',
  'Arquitectura UI → hook → repo → DB',
  'WhatsApp, vCard y compartir',
  'Duplicados + sugerir mensaje (IA local)',
  'Sesion local y despliegue Vercel',
];

export default function PanelProyecto({
  grupos = [],
  plantillas = [],
  onIr,
}) {
  const total = totalContactos();
  const favoritos = totalFavoritos();
  const reparto = repartoPorGrupo();

  return (
    <section className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi etiqueta="Contactos" valor={total} />
        <Kpi etiqueta="Favoritos" valor={favoritos} />
        <Kpi etiqueta="Grupos" valor={grupos.length} />
        <Kpi etiqueta="Plantillas" valor={plantillas.length} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Modulos del proyecto
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODULOS.map((m) => {
            const Ico = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onIr(m.id)}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-lucid-blue hover:bg-lucid-blueSoft"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700">
                  <Ico className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {m.titulo}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {m.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <IconFolder className="h-4 w-4 text-slate-500" />
            Grupos
          </h3>
          {reparto.length === 0 ? (
            <p className="text-xs text-slate-500">Sin grupos aun.</p>
          ) : (
            <ul className="space-y-2">
              {reparto.map((g) => (
                <li
                  key={g.grupo}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-slate-700">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: g.color }}
                    />
                    {g.grupo}
                  </span>
                  <span className="text-xs text-slate-400">{g.total}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Hitos del lab
          </h3>
          <ul className="space-y-2">
            {HITOS.map((h) => (
              <li key={h} className="flex gap-2 text-xs text-slate-600">
                <span className="mt-0.5 text-lucid-blue" aria-hidden>
                  ✓
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Kpi({ etiqueta, valor }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {etiqueta}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold text-slate-900">
        {valor}
      </p>
    </div>
  );
}
