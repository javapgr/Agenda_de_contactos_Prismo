import { MARCA } from '../brand.js';

const CAPACIDADES = [
  {
    titulo: 'Contactos',
    texto: 'Registrar, buscar, ordenar y agrupar. Favoritos y recientes.',
  },
  {
    titulo: 'WhatsApp',
    texto: 'Plantillas con el nombre del contacto y sugerencias de mensaje.',
  },
  {
    titulo: 'Respaldo',
    texto: 'SQLite en el navegador, exportar .db y descargar vCard.',
  },
];

export default function Landing({ onEmpezar, onEntrar }) {
  return (
    <div className="min-h-screen overflow-y-auto bg-[#0b1220] font-sans text-slate-100">
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,102,245,0.35), transparent 55%), radial-gradient(ellipse 40% 30% at 90% 20%, rgba(14,165,233,0.12), transparent)',
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <p className="font-display text-lg font-semibold tracking-tight">
          {MARCA.nombre}
        </p>
        <button
          type="button"
          onClick={onEntrar}
          className="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
        >
          Iniciar sesion
        </button>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-10 lg:pb-20 lg:pt-16">
          <p className="prismo-rise text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Proyecto estudiantil · SENATI
          </p>
          <p className="prismo-rise mt-3 font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {MARCA.nombre}
          </p>
          <h1 className="prismo-rise-delay mt-4 max-w-xl text-xl font-medium leading-snug text-slate-200 sm:text-2xl">
            Agenda para gestionar contactos, grupos y mensajes.
          </h1>
          <p className="prismo-rise-delay-2 mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
            Lab de React, SQLite y WhatsApp: crea tu usuario e ingresa al panel
            para administrar tu agenda.
          </p>
          <div className="prismo-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onEmpezar}
              className="rounded-md bg-lucid-blue px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              Crear usuario
            </button>
            <button
              type="button"
              onClick={onEntrar}
              className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Iniciar sesion
            </button>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#080d18]">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Que puedes gestionar
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {CAPACIDADES.map((c) => (
                <div key={c.titulo}>
                  <h3 className="text-sm font-semibold text-white">{c.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {c.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-5 py-6 text-center text-[11px] text-slate-500">
        {MARCA.nombre} · proyecto estudiantil · SENATI
      </footer>
    </div>
  );
}
