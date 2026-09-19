function polar(cx, cy, r, angulo) {
  const rad = ((angulo - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arco(cx, cy, r, inicio, fin) {
  const a = polar(cx, cy, r, fin);
  const b = polar(cx, cy, r, inicio);
  const grande = fin - inicio > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${grande} 0 ${b.x} ${b.y}`;
}

export function DonutGrupos({ datos, tamaño = 160 }) {
  const total = datos.reduce((s, d) => s + Number(d.total), 0);
  const cx = tamaño / 2;
  const cy = tamaño / 2;
  const r = tamaño * 0.36;
  const stroke = tamaño * 0.14;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6">
        <svg width={tamaño} height={tamaño} viewBox={`0 0 ${tamaño} ${tamaño}`}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-400 text-sm"
          >
            0
          </text>
        </svg>
        <p className="text-sm text-slate-400">Sin contactos aun</p>
      </div>
    );
  }

  let angulo = 0;
  const segmentos = datos
    .filter((d) => Number(d.total) > 0)
    .map((d) => {
      const porcion = (Number(d.total) / total) * 360;
      const inicio = angulo;
      const fin = angulo + porcion;
      angulo = fin;
      return { ...d, inicio, fin: fin >= 359.99 ? 359.99 : fin };
    });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
      <svg width={tamaño} height={tamaño} viewBox={`0 0 ${tamaño} ${tamaño}`}>
        {segmentos.map((s) =>
          s.fin - s.inicio >= 359 ? (
            <circle
              key={s.grupo}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color || '#64748b'}
              strokeWidth={stroke}
            />
          ) : (
            <path
              key={s.grupo}
              d={arco(cx, cy, r, s.inicio, s.fin)}
              fill="none"
              stroke={s.color || '#64748b'}
              strokeWidth={stroke}
              strokeLinecap="butt"
            />
          )
        )}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-slate-900 text-xl font-semibold"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          className="fill-slate-400 text-[11px]"
        >
          contactos
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {datos.map((d) => {
          const pct = total ? Math.round((Number(d.total) / total) * 100) : 0;
          return (
            <li key={d.grupo} className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color || '#64748b' }}
              />
              <span className="min-w-[5rem]">{d.grupo}</span>
              <span className="tabular-nums text-slate-900">
                {d.total} ({pct}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AnilloFavoritos({ total, favoritos, tamaño = 100 }) {
  const pct = total ? favoritos / total : 0;
  const cx = tamaño / 2;
  const cy = tamaño / 2;
  const r = tamaño * 0.36;
  const stroke = tamaño * 0.12;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <svg width={tamaño} height={tamaño} viewBox={`0 0 ${tamaño} ${tamaño}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={stroke}
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-900 text-sm font-semibold"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div className="text-sm">
        <p className="font-medium text-slate-800">Favoritos</p>
        <p className="text-slate-500">
          {favoritos} de {total}
        </p>
      </div>
    </div>
  );
}
