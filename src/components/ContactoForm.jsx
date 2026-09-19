import { useState, useEffect } from 'react';

const VACIO = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  grupo_id: '',
  favorito: false,
  notas: '',
  cumple: '',
};

export default function ContactoForm({ editando, grupos, onGuardar, onCancelar }) {
  const [form, setForm] = useState(VACIO);
  const [fallos, setFallos] = useState({});

  useEffect(() => {
    const base = editando
      ? { ...editando, favorito: !!editando.favorito, cumple: editando.cumple || '' }
      : { ...VACIO, grupo_id: grupos[0]?.id ?? '' };
    setForm(base);
    setFallos({});
  }, [editando, grupos]);

  const cambiar = (campo) => (e) =>
    setForm({
      ...form,
      [campo]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.type === 'number' || campo === 'grupo_id'
            ? Number(e.target.value)
            : e.target.value,
    });

  const validar = () => {
    const f = {};
    if (!form.nombre.trim()) f.nombre = 'Escribe el nombre';
    if (!/^[0-9+\s]{6,15}$/.test(form.telefono)) f.telefono = 'Telefono no valido';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) f.email = 'Correo no valido';
    if (!form.grupo_id) f.grupo_id = 'Elige un grupo';
    setFallos(f);
    return Object.keys(f).length === 0;
  };

  const enviar = () => {
    if (!validar()) return;
    if (onGuardar(form)) setForm({ ...VACIO, grupo_id: grupos[0]?.id ?? '' });
  };

  const input =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';

  return (
    <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold">
        {editando ? 'Editar contacto' : 'Nuevo contacto'}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            className={input}
            placeholder="Nombre"
            value={form.nombre}
            onChange={cambiar('nombre')}
          />
          {fallos.nombre && (
            <p className="mt-1 text-xs text-red-600">{fallos.nombre}</p>
          )}
        </div>
        <div>
          <label className="sr-only" htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            className={input}
            placeholder="Apellido"
            value={form.apellido}
            onChange={cambiar('apellido')}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="telefono">Telefono</label>
          <input
            id="telefono"
            className={input}
            placeholder="Telefono: 965123456"
            value={form.telefono}
            onChange={cambiar('telefono')}
          />
          {fallos.telefono && (
            <p className="mt-1 text-xs text-red-600">{fallos.telefono}</p>
          )}
        </div>
        <div>
          <label className="sr-only" htmlFor="email">Correo</label>
          <input
            id="email"
            className={input}
            placeholder="Correo"
            value={form.email}
            onChange={cambiar('email')}
          />
          {fallos.email && (
            <p className="mt-1 text-xs text-red-600">{fallos.email}</p>
          )}
        </div>
        <div>
          <label className="sr-only" htmlFor="grupo">Grupo</label>
          <select
            id="grupo"
            className={input}
            value={form.grupo_id}
            onChange={cambiar('grupo_id')}
          >
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
          {fallos.grupo_id && (
            <p className="mt-1 text-xs text-red-600">{fallos.grupo_id}</p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.favorito}
            onChange={cambiar('favorito')}
          />
          Marcar como favorito
        </label>
        <div>
          <label className="mb-1 block text-xs text-slate-500" htmlFor="cumple">
            Cumpleanos
          </label>
          <input
            id="cumple"
            type="date"
            className={input}
            value={form.cumple || ''}
            onChange={cambiar('cumple')}
          />
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="notas">Notas</label>
        <textarea
          id="notas"
          className={input}
          placeholder="Notas"
          rows={2}
          value={form.notas}
          onChange={cambiar('notas')}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={enviar}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {editando ? 'Guardar cambios' : 'Agregar contacto'}
        </button>
        {editando && (
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
