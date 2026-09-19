export default function DialogoConfirmar({
  mensaje,
  onAceptar,
  onCancelar,
  etiquetaAceptar = 'Confirmar',
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancelar();
      }}
    >
      <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-4 shadow-lg">
        <p className="text-sm text-slate-700">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onAceptar}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {etiquetaAceptar}
          </button>
        </div>
      </div>
    </div>
  );
}
