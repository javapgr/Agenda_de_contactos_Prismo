export default function EstadoVacio({ tipo, onAccion }) {
  if (tipo === 'agenda') {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">Tu agenda esta vacia.</p>
        <p className="mt-1 text-xs text-slate-400">
          Agrega el primer contacto con el formulario de arriba.
        </p>
        <button
          type="button"
          onClick={onAccion}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ir al formulario
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <p className="text-sm text-slate-600">No hay resultados para esta busqueda.</p>
      <button
        type="button"
        onClick={onAccion}
        className="mt-3 rounded-lg border px-4 py-2 text-sm"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
