export function formatearCumple(iso) {
  if (!iso) return '';
  const [anio, mes, dia] = String(iso).split('-');
  if (!anio || !mes || !dia) return '';
  return `${dia}/${mes}/${anio}`;
}
