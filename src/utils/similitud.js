export const UMBRAL_SIMILITUD = 0.85;

export function normalizarTexto(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function distanciaLevenshtein(a, b) {
  const s = normalizarTexto(a);
  const t = normalizarTexto(b);
  const m = s.length;
  const n = t.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const costo = s[i - 1] === t[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + costo);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

export function similitud(a, b) {
  const s = normalizarTexto(a);
  const t = normalizarTexto(b);
  if (!s && !t) return 1;
  if (!s || !t) return 0;
  const dist = distanciaLevenshtein(s, t);
  return 1 - dist / Math.max(s.length, t.length);
}

export function buscarDuplicados(nuevo, existentes, umbral = UMBRAL_SIMILITUD) {
  const nombreNuevo = `${nuevo.nombre || ''} ${nuevo.apellido || ''}`.trim();
  const telNuevo = String(nuevo.telefono || '').replace(/\D/g, '');

  return existentes
    .filter((c) => c.id !== nuevo.id)
    .map((c) => {
      const nombreExist = `${c.nombre || ''} ${c.apellido || ''}`.trim();
      const telExist = String(c.telefono || '').replace(/\D/g, '');
      const scoreNombre = similitud(nombreNuevo, nombreExist);
      const scoreTel = similitud(telNuevo, telExist);
      const score = Math.max(scoreNombre, scoreTel);
      return { contacto: c, score, scoreNombre, scoreTel };
    })
    .filter((d) => d.score >= umbral)
    .sort((a, b) => b.score - a.score);
}
