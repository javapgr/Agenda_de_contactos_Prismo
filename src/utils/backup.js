export function descargarAgenda(bytes) {
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agenda.db';
  a.click();
  URL.revokeObjectURL(url);
}

export async function leerArchivoDb(archivo) {
  const buffer = await archivo.arrayBuffer();
  return new Uint8Array(buffer);
}
