const CLAVE_USERS = 'prismo_usuarios_v1';
const CLAVE_SESION = 'prismo_sesion_v1';

function leerLista() {
  try {
    const raw = localStorage.getItem(CLAVE_USERS);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function guardarLista(lista) {
  localStorage.setItem(CLAVE_USERS, JSON.stringify(lista));
}

export function leerSesion() {
  try {
    const raw = localStorage.getItem(CLAVE_SESION);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u?.email || !u?.nombre) return null;
    return u;
  } catch {
    return null;
  }
}

export function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  return usuario;
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

export function crearUsuario({ nombre, email }) {
  const n = String(nombre || '').trim();
  const e = String(email || '').trim().toLowerCase();
  if (!n) throw new Error('Escribe tu nombre.');
  if (!e || !e.includes('@')) throw new Error('Escribe un email valido.');

  const lista = leerLista();
  if (lista.some((u) => u.email === e)) {
    throw new Error('Ese email ya esta registrado en este navegador.');
  }
  const usuario = { nombre: n, email: e, creado: Date.now() };
  guardarLista([...lista, usuario]);
  return guardarSesion(usuario);
}

export function iniciarSesion({ email }) {
  const e = String(email || '').trim().toLowerCase();
  if (!e || !e.includes('@')) throw new Error('Escribe un email valido.');

  const usuario = leerLista().find((u) => u.email === e);
  if (!usuario) {
    throw new Error('No hay usuario con ese email. Crea una cuenta.');
  }
  return guardarSesion(usuario);
}

export function inicialesDe(nombre = '') {
  const partes = String(nombre).trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}
