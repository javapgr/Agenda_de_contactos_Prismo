export default function AlertaDuplicado({
  nuevo,
  duplicado,
  score,
  onFusionar,
  onCrearIgual,
  onCancelar,
}) {
  const pct = Math.round(score * 100);
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-dup"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancelar();
      }}
    >
      <div className="w-full max-w-md space-y-3 rounded-xl bg-white p-4 shadow-lg">
        <h2 id="titulo-dup" className="text-base font-semibold">
          Posible duplicado ({pct}%)
        </h2>
        <p className="text-sm text-slate-600">
          «{nuevo.nombre} {nuevo.apellido}» se parece a «{duplicado.nombre}{' '}
          {duplicado.apellido}» ({duplicado.telefono}).
        </p>
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
            onClick={onCrearIgual}
            className="rounded-lg border px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Crear igual
          </button>
          <button
            type="button"
            onClick={onFusionar}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Fusionar
          </button>
        </div>
      </div>
    </div>
  );
}
