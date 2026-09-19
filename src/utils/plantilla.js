export function varsContacto(c = {}) {
  const nombre = String(c.nombre || '').trim();
  const apellido = String(c.apellido || '').trim();
  const completo = [nombre, apellido].filter(Boolean).join(' ');
  return {
    nombre: completo || nombre || 'amigo',
    apellido,
    grupo: c.grupo || '',
    telefono: c.telefono || '',
  };
}

export function aplicarPlantilla(cuerpo, vars = {}) {
  return String(cuerpo).replace(/\{(\w+)\}/g, (_, clave) =>
    vars[clave] != null ? String(vars[clave]) : ''
  );
}
