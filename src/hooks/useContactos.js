import { useState, useEffect, useCallback } from 'react';
import { iniciarDB, exportarBytes, importarBytes } from '../db/database.js';
import * as repo from '../db/contactosRepo.js';

export function useContactos() {
  const [listos, setListos] = useState(false);
  const [contactos, setContactos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [texto, setTexto] = useState('');
  const [grupoId, setGrupoId] = useState(0);
  const [orden, setOrden] = useState('nombre');
  const [error, setError] = useState('');
  const [statsKey, setStatsKey] = useState(0);

  const refrescar = useCallback(() => {
    setContactos(repo.listarContactos({ texto, grupoId, orden }));
    setGrupos(repo.listarGrupos());
    setPlantillas(repo.listarPlantillas());
    setStatsKey((k) => k + 1);
  }, [texto, grupoId, orden]);

  useEffect(() => {
    iniciarDB().then(() => setListos(true));
  }, []);

  useEffect(() => {
    if (listos) refrescar();
  }, [listos, refrescar]);

  const ejecutar = (accion) => {
    try {
      accion();
      setError('');
      refrescar();
      return true;
    } catch (e) {
      setError(
        String(e.message).includes('UNIQUE')
          ? 'Ese numero o grupo ya esta registrado.'
          : String(e.message).includes('Escribe un nombre')
            ? e.message
            : String(e.message).includes('al menos un grupo')
              ? e.message
              : 'No se pudo guardar. Revisa los datos.'
      );
      return false;
    }
  };

  return {
    listos,
    contactos,
    grupos,
    plantillas,
    texto,
    grupoId,
    orden,
    error,
    statsKey,
    setTexto,
    setGrupoId,
    setOrden,
    limpiarError: () => setError(''),
    crear: (c) => ejecutar(() => repo.crearContacto(c)),
    actualizar: (id, c) => ejecutar(() => repo.actualizarContacto(id, c)),
    eliminar: (id) => ejecutar(() => repo.eliminarContacto(id)),
    favorito: (id) => ejecutar(() => repo.alternarFavorito(id)),
    whatsapp: (id, textoMsg) =>
      ejecutar(() => repo.registrarMensaje(id, textoMsg)),
    crearGrupo: (nombre, color) =>
      ejecutar(() => repo.crearGrupo(nombre, color)),
    eliminarGrupo: (id) => ejecutar(() => repo.eliminarGrupo(id)),
    guardarPlantilla: (id, cuerpo) =>
      ejecutar(() => repo.actualizarPlantilla(id, cuerpo)),
    fusionar: (idBase, datos) =>
      ejecutar(() => repo.actualizarContacto(idBase, datos)),
    exportar: () => exportarBytes(),
    importar: (bytes) => ejecutar(() => importarBytes(bytes)),
  };
}
