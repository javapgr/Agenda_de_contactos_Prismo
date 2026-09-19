import { useState, useRef, useEffect } from 'react';
import { useContactos } from './hooks/useContactos.js';
import ContactoForm from './components/ContactoForm.jsx';
import ContactoFila from './components/ContactoFila.jsx';
import DialogoConfirmar from './components/DialogoConfirmar.jsx';
import PanelEstadisticas from './components/PanelEstadisticas.jsx';
import PanelProyecto from './components/PanelProyecto.jsx';
import PanelPlantillas from './components/PanelPlantillas.jsx';
import SelectorPlantilla from './components/SelectorPlantilla.jsx';
import AlertaDuplicado from './components/AlertaDuplicado.jsx';
import PantallaSesion from './components/PantallaSesion.jsx';
import Landing from './components/Landing.jsx';
import { descargarAgenda, leerArchivoDb } from './utils/backup.js';
import { buscarDuplicados } from './utils/similitud.js';
import {
  leerSesion,
  cerrarSesion,
  inicialesDe,
} from './utils/sesion.js';
import { MARCA } from './brand.js';
import {
  IconHome,
  IconContacts,
  IconGrid,
  IconPuzzle,
  IconClock,
  IconStar,
  IconFolder,
  IconShare,
  IconSearch,
  IconChevron,
  IconDownload,
  IconUpload,
  IconStats,
  IconTrash,
  IconMenu,
} from './components/Icons.jsx';

const ORDENES = [
  { valor: 'nombre', etiqueta: 'Nombre A-Z' },
  { valor: 'recientes', etiqueta: 'Mas recientes' },
  { valor: 'categoria', etiqueta: 'Grupo' },
];

function NavBtn({ active, onClick, icon: Ico, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] outline-none focus:outline-none focus-visible:outline-none ${
        active
          ? 'bg-lucid-dark2 text-white'
          : 'text-[#c5c9ce] hover:bg-lucid-dark2 hover:text-white'
      }`}
    >
      <Ico className="h-5 w-5 opacity-90" />
      <span>{children}</span>
    </button>
  );
}

function SubBtn({ active, onClick, icon: Ico, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] outline-none focus:outline-none focus-visible:outline-none ${
        active
          ? 'bg-white font-medium text-slate-900 shadow-sm'
          : 'text-slate-600 hover:bg-white/70'
      }`}
    >
      <Ico className="h-[16px] w-[16px] text-slate-500" />
      <span className="truncate">{children}</span>
    </button>
  );
}

export default function App() {
  const {
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
    limpiarError,
    crear,
    actualizar,
    eliminar,
    favorito,
    whatsapp,
    crearGrupo,
    eliminarGrupo,
    guardarPlantilla,
    fusionar,
    exportar,
    importar,
  } = useContactos();

  const [editando, setEditando] = useState(null);
  const [pendienteBorrar, setPendienteBorrar] = useState(null);
  const [pendienteImport, setPendienteImport] = useState(null);
  const [pendienteGrupo, setPendienteGrupo] = useState(null);
  const [whatsAppPara, setWhatsAppPara] = useState(null);
  const [pendienteDup, setPendienteDup] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [nuevoGrupo, setNuevoGrupo] = useState('');
  const [avisoGrupo, setAvisoGrupo] = useState('');
  const [vista, setVista] = useState('proyecto');
  const [filtroSec, setFiltroSec] = useState('todos');
  const [gruposAbiertos, setGruposAbiertos] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const fileRef = useRef(null);
  const grupoInputRef = useRef(null);
  const [usuario, setUsuario] = useState(() => leerSesion());
  const [gate, setGate] = useState('landing');
  const [authModo, setAuthModo] = useState('entrar');

  useEffect(() => {
    if (!error) return undefined;
    const t = setTimeout(() => limpiarError(), 3500);
    return () => clearTimeout(t);
  }, [error, limpiarError]);

  useEffect(() => {
    if (!avisoGrupo) return undefined;
    const t = setTimeout(() => setAvisoGrupo(''), 3000);
    return () => clearTimeout(t);
  }, [avisoGrupo]);

  useEffect(() => {
    setMenuAbierto(false);
  }, [vista, filtroSec, grupoId]);

  const salir = () => {
    cerrarSesion();
    setUsuario(null);
    setGate('landing');
  };

  const irContactos = (sec = 'todos', gId = 0) => {
    setEditando(null);
    setVista('contactos');
    setFiltroSec(sec);
    setGrupoId(gId);
    if (sec === 'recientes') setOrden('recientes');
    else if (sec === 'todos' || sec === 'favoritos') setOrden('nombre');
  };

  const irProyecto = () => {
    setEditando(null);
    setVista('proyecto');
  };

  const irVista = (id) => {
    setEditando(null);
    if (id === 'contactos') irContactos('todos');
    else if (id === 'proyecto') irProyecto();
    else setVista(id);
  };

  const irNuevo = () => {
    setEditando(null);
    setFormKey((k) => k + 1);
    setVista('nuevo');
  };

  const resetForm = () => {
    setEditando(null);
    setFormKey((k) => k + 1);
  };

  const guardar = (datos, { ignorarDup = false } = {}) => {
    if (editando) {
      const ok = actualizar(editando.id, datos);
      if (ok) {
        resetForm();
        irContactos('todos');
      }
      return ok;
    }
    if (!ignorarDup) {
      const dups = buscarDuplicados(datos, contactos);
      if (dups.length) {
        setPendienteDup({ datos, match: dups[0] });
        return false;
      }
    }
    const ok = crear(datos);
    if (ok) {
      resetForm();
      irContactos('todos');
    }
    return ok;
  };

  const agregarGrupo = () => {
    const n = nuevoGrupo.trim();
    if (!n) {
      setAvisoGrupo('Escribe un nombre de grupo.');
      grupoInputRef.current?.focus();
      return;
    }
    if (
      grupos.some((g) => g.nombre.toLowerCase() === n.toLowerCase())
    ) {
      setAvisoGrupo('Ese grupo ya existe.');
      grupoInputRef.current?.focus();
      return;
    }
    if (crearGrupo(n)) {
      setNuevoGrupo('');
      setAvisoGrupo('');
    }
  };

  const lista = contactos.filter((c) => {
    if (filtroSec === 'favoritos') return Number(c.favorito) === 1;
    return true;
  });

  const titulo =
    vista === 'proyecto'
      ? 'Panel del proyecto'
      : vista === 'nuevo'
        ? editando
          ? 'Editar contacto'
          : 'Nuevo contacto'
        : vista === 'plantillas'
          ? 'Plantillas de WhatsApp'
          : vista === 'respaldo'
            ? 'Respaldo de agenda'
            : vista === 'stats'
              ? 'Estadisticas'
              : filtroSec === 'favoritos'
                ? 'Favoritos'
                : filtroSec === 'recientes'
                  ? 'Recientes'
                  : filtroSec === 'grupo'
                    ? grupos.find((g) => g.id === grupoId)?.nombre || 'Grupo'
                    : 'Contactos';

  const vacioMsg =
    filtroSec === 'favoritos'
      ? 'Aqui aparecen los contactos cuando los marcas como favoritos.'
      : texto
        ? 'No hay resultados para esta busqueda.'
        : 'Tu agenda esta vacia. Crea el primer contacto.';

  if (!usuario) {
    if (gate === 'auth') {
      return (
        <PantallaSesion
          key={authModo}
          modoInicial={authModo}
          onEntrar={setUsuario}
          onVolver={() => setGate('landing')}
        />
      );
    }
    return (
      <Landing
        onEmpezar={() => {
          setAuthModo('crear');
          setGate('auth');
        }}
        onEntrar={() => {
          setAuthModo('entrar');
          setGate('auth');
        }}
      />
    );
  }

  if (!listos) {
    return (
      <div className="grid min-h-screen place-items-center bg-lucid-grey font-sans text-slate-500">
        Cargando {MARCA.nombre}...
      </div>
    );
  }

  const inicialesUser = inicialesDe(usuario.nombre);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-800">
      <header className="flex h-12 shrink-0 items-center gap-2 bg-lucid-dark px-2 text-white sm:gap-4 sm:px-3">
        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-white hover:bg-white/10 md:hidden"
          aria-label={menuAbierto ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <IconMenu className="h-5 w-5" />
        </button>
        <div className="hidden w-[200px] items-center gap-2 md:flex">
          <span className="font-display text-[17px] font-semibold tracking-tight">
            {MARCA.nombre}
          </span>
        </div>
        <div className="relative min-w-0 flex-1 mx-auto max-w-xl">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0a6]" />
          <label className="sr-only" htmlFor="buscar">
            Buscar
          </label>
          <input
            id="buscar"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              irContactos(filtroSec === 'grupo' ? 'grupo' : 'todos', grupoId);
            }}
            placeholder="Buscar contacto"
            className="w-full rounded-md border-0 bg-lucid-search py-1.5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#9aa0a6] focus:outline-none focus-visible:ring-2 focus-visible:ring-lucid-blue"
          />
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={irNuevo}
            className="rounded-md bg-lucid-blue px-2.5 py-1.5 text-xs font-semibold text-white hover:brightness-110 md:hidden"
          >
            + Nuevo
          </button>
          <span className="hidden text-xs text-[#9aa0a6] lg:inline" aria-live="polite">
            {lista.length} contactos
          </span>
          <span className="hidden max-w-[9rem] truncate text-xs text-[#c5c9ce] md:inline">
            {usuario.nombre}
          </span>
          <button
            type="button"
            onClick={salir}
            className="rounded-md border border-white/20 px-2 py-1 text-[11px] text-[#c5c9ce] hover:bg-white/10"
          >
            Salir
          </button>
          <div className="grid h-7 w-7 place-items-center rounded-full bg-lucid-blue text-[11px] font-semibold">
            {inicialesUser}
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {menuAbierto && (
          <button
            type="button"
            aria-label="Cerrar menu"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMenuAbierto(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-lucid-dark text-white transition-transform duration-200 md:static md:z-auto md:w-[200px] md:translate-x-0 ${
            menuAbierto ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center gap-2.5 px-3 py-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-lucid-blue text-xs font-semibold">
              {inicialesUser}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[13px] font-medium">{usuario.nombre}</p>
              <p className="truncate text-[11px] text-[#9aa0a6]">{usuario.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={irNuevo}
            className="mx-3 mb-3 rounded-md bg-lucid-blue px-3 py-2 text-[13px] font-semibold text-white hover:brightness-110"
          >
            + Nuevo contacto
          </button>

          <nav className="flex flex-1 flex-col gap-0.5 px-2" aria-label="Principal">
            <NavBtn
              active={vista === 'proyecto'}
              onClick={irProyecto}
              icon={IconHome}
            >
              Inicio
            </NavBtn>
            <NavBtn
              active={
                vista === 'contactos' &&
                (filtroSec === 'todos' ||
                  filtroSec === 'grupo' ||
                  filtroSec === 'recientes' ||
                  filtroSec === 'favoritos')
              }
              onClick={() => irContactos('todos')}
              icon={IconContacts}
            >
              Contactos
            </NavBtn>
            <NavBtn
              active={vista === 'stats'}
              onClick={() => {
                setEditando(null);
                setVista('stats');
              }}
              icon={IconStats}
            >
              Estadisticas
            </NavBtn>
          </nav>

          <div className="mt-auto space-y-0.5 border-t border-[#2d3136] px-2 py-3">
            <NavBtn
              active={vista === 'plantillas'}
              onClick={() => {
                setEditando(null);
                setVista('plantillas');
              }}
              icon={IconGrid}
            >
              Plantillas
            </NavBtn>
            <NavBtn
              active={vista === 'respaldo'}
              onClick={() => {
                setEditando(null);
                setVista('respaldo');
              }}
              icon={IconPuzzle}
            >
              Respaldo
            </NavBtn>
            <div className="space-y-0.5 border-t border-[#2d3136] pt-2 md:hidden">
              <p className="px-3 py-1 text-[10px] uppercase tracking-wide text-[#9aa0a6]">
                Filtros
              </p>
              <NavBtn
                active={vista === 'contactos' && filtroSec === 'recientes'}
                onClick={() => irContactos('recientes')}
                icon={IconClock}
              >
                Recientes
              </NavBtn>
              <NavBtn
                active={vista === 'contactos' && filtroSec === 'favoritos'}
                onClick={() => irContactos('favoritos')}
                icon={IconStar}
              >
                Favoritos
              </NavBtn>
              {grupos.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => irContactos('grupo', g.id)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] ${
                    vista === 'contactos' &&
                    filtroSec === 'grupo' &&
                    grupoId === g.id
                      ? 'bg-lucid-dark2 text-white'
                      : 'text-[#c5c9ce] hover:bg-lucid-dark2 hover:text-white'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="truncate">{g.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-lucid-line bg-lucid-grey lg:flex">
          <nav className="flex-1 space-y-0.5 p-2 pt-3" aria-label="Filtros">
            <SubBtn
              active={vista === 'proyecto'}
              onClick={irProyecto}
              icon={IconHome}
            >
              Inicio
            </SubBtn>
            <SubBtn
              active={vista === 'contactos' && filtroSec === 'todos'}
              onClick={() => irContactos('todos')}
              icon={IconContacts}
            >
              Todos
            </SubBtn>
            <SubBtn
              active={vista === 'contactos' && filtroSec === 'recientes'}
              onClick={() => irContactos('recientes')}
              icon={IconClock}
            >
              Recientes
            </SubBtn>
            <SubBtn
              active={vista === 'contactos' && filtroSec === 'favoritos'}
              onClick={() => irContactos('favoritos')}
              icon={IconStar}
            >
              Favoritos
            </SubBtn>

            <button
              type="button"
              onClick={() => setGruposAbiertos((v) => !v)}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-slate-600 hover:bg-white/80"
            >
              <IconFolder className="h-[16px] w-[16px] text-slate-500" />
              <span className="flex-1">Grupos</span>
              <IconChevron
                className={`h-3.5 w-3.5 text-slate-400 transition ${
                  gruposAbiertos ? 'rotate-90' : ''
                }`}
              />
            </button>

            {gruposAbiertos && (
              <div className="ml-2 space-y-0.5 border-l border-slate-200 pl-2">
                {grupos.map((g) => (
                  <div
                    key={g.id}
                    className={`flex items-center gap-1 rounded-md px-1 ${
                      vista === 'contactos' &&
                      filtroSec === 'grupo' &&
                      grupoId === g.id
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => irContactos('grupo', g.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 px-1 py-1.5 text-left text-[12px] text-slate-600"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: g.color }}
                      />
                      <span className="truncate">{g.nombre}</span>
                    </button>
                    <button
                      type="button"
                      title={`Eliminar grupo ${g.nombre}`}
                      aria-label={`Eliminar grupo ${g.nombre}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendienteGrupo(g);
                      }}
                      className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <SubBtn
              active={false}
              onClick={() => irContactos('todos')}
              icon={IconShare}
            >
              Compartir / vCard
            </SubBtn>
          </nav>

          <div className="space-y-2 border-t border-lucid-line p-3">
            <input
              ref={grupoInputRef}
              className={`w-full rounded-md border bg-white px-2 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-lucid-blue ${
                avisoGrupo
                  ? 'border-amber-400'
                  : 'border-slate-300'
              }`}
              placeholder="Nuevo grupo"
              value={nuevoGrupo}
              onChange={(e) => {
                setNuevoGrupo(e.target.value);
                if (avisoGrupo) setAvisoGrupo('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') agregarGrupo();
              }}
              aria-label="Nuevo grupo"
              aria-invalid={Boolean(avisoGrupo)}
              aria-describedby={avisoGrupo ? 'aviso-grupo' : undefined}
            />
            {avisoGrupo && (
              <p
                id="aviso-grupo"
                role="status"
                className="text-[11px] text-amber-700"
              >
                {avisoGrupo}
              </p>
            )}
            <button
              type="button"
              onClick={agregarGrupo}
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs hover:bg-slate-50"
            >
              Crear grupo
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-white">
          {vista !== 'proyecto' && (
            <div className="flex items-center justify-between border-b border-lucid-line px-4 py-3 sm:px-6 sm:py-4">
              <h1 className="font-display text-lg font-semibold tracking-tight text-slate-900 sm:text-[22px]">
                {titulo}
              </h1>
              {vista === 'contactos' && (
                <select
                  className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  aria-label="Ordenar"
                >
                  {ORDENES.map((o) => (
                    <option key={o.valor} value={o.valor}>
                      {o.etiqueta}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            {vista === 'proyecto' && (
              <PanelProyecto
                key={statsKey}
                grupos={grupos}
                plantillas={plantillas}
                onIr={irVista}
              />
            )}

            {vista === 'nuevo' && (
              <ContactoForm
                key={formKey}
                editando={editando}
                grupos={grupos}
                onGuardar={(datos) => guardar(datos)}
                onCancelar={() => irContactos('todos')}
              />
            )}

            {vista === 'stats' && <PanelEstadisticas key={statsKey} />}

            {vista === 'plantillas' && (
              <PanelPlantillas
                plantillas={plantillas}
                onGuardar={guardarPlantilla}
              />
            )}

            {vista === 'respaldo' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  Exporta el archivo SQLite real o importa uno para reemplazar la
                  agenda.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => descargarAgenda(exportar())}
                    className="inline-flex items-center gap-2 rounded-md border border-lucid-line px-4 py-2 text-sm hover:bg-lucid-grey"
                  >
                    <IconDownload className="h-4 w-4" />
                    Exportar agenda.db
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md border border-lucid-line px-4 py-2 text-sm hover:bg-lucid-grey"
                  >
                    <IconUpload className="h-4 w-4" />
                    Importar agenda.db
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".db,application/octet-stream"
                    className="hidden"
                    aria-label="Seleccionar agenda.db"
                    onChange={async (e) => {
                      const archivo = e.target.files?.[0];
                      e.target.value = '';
                      if (!archivo) return;
                      setPendienteImport(await leerArchivoDb(archivo));
                    }}
                  />
                </div>
              </div>
            )}

            {vista === 'contactos' && (
              <div className="-mx-4 sm:-mx-6">
                {filtroSec === 'todos' && !texto && (
                  <p className="mb-3 px-4 text-xs text-slate-500 sm:px-6">
                    Usa WhatsApp, Compartir o .vcf en cada fila. Estrella = favorito.
                  </p>
                )}
                <div className="hidden gap-2 border-y border-slate-300 bg-[#f3f4f6] px-7 py-2.5 text-[12px] font-semibold text-slate-600 md:grid md:grid-cols-[minmax(0,1fr)_8rem_6.5rem_auto]">
                  <span>Nombre</span>
                  <span>Telefono</span>
                  <span>Grupo</span>
                  <span className="text-right">Acciones</span>
                </div>

                {lista.length === 0 ? (
                  <div className="px-4 py-16 text-center sm:px-6">
                    <p className="text-[13px] text-slate-400">{vacioMsg}</p>
                    {!texto && filtroSec === 'todos' && (
                      <button
                        type="button"
                        onClick={irNuevo}
                        className="mt-4 rounded-md bg-lucid-blue px-4 py-2 text-sm font-semibold text-white"
                      >
                        + Nuevo contacto
                      </button>
                    )}
                    {texto && (
                      <button
                        type="button"
                        onClick={() => setTexto('')}
                        className="mt-4 rounded-md border px-4 py-2 text-sm"
                      >
                        Limpiar busqueda
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="px-4 sm:px-6">
                    {lista.map((c) => (
                      <ContactoFila
                        key={c.id}
                        c={c}
                        onEditar={(contacto) => {
                          setEditando(contacto);
                          setFormKey((k) => k + 1);
                          setVista('nuevo');
                        }}
                        onEliminar={setPendienteBorrar}
                        onFavorito={favorito}
                        onWhatsApp={setWhatsAppPara}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {pendienteBorrar && (
        <DialogoConfirmar
          mensaje={`Eliminar a ${pendienteBorrar.nombre} ${pendienteBorrar.apellido}?`}
          etiquetaAceptar="Eliminar"
          onAceptar={() => {
            eliminar(pendienteBorrar.id);
            setPendienteBorrar(null);
          }}
          onCancelar={() => setPendienteBorrar(null)}
        />
      )}

      {pendienteGrupo && (
        <DialogoConfirmar
          mensaje={`Eliminar el grupo «${pendienteGrupo.nombre}»? Sus contactos pasaran a otro grupo.`}
          etiquetaAceptar="Eliminar grupo"
          onAceptar={() => {
            const ok = eliminarGrupo(pendienteGrupo.id);
            setPendienteGrupo(null);
            if (ok) irContactos('todos');
          }}
          onCancelar={() => setPendienteGrupo(null)}
        />
      )}

      {pendienteImport && (
        <DialogoConfirmar
          mensaje="Importar reemplazara toda la agenda actual. Continuar?"
          etiquetaAceptar="Importar"
          onAceptar={() => {
            importar(pendienteImport);
            setPendienteImport(null);
            irContactos('todos');
          }}
          onCancelar={() => setPendienteImport(null)}
        />
      )}

      {whatsAppPara && (
        <SelectorPlantilla
          contacto={whatsAppPara}
          plantillas={plantillas}
          onEnviar={(mensaje) => {
            whatsapp(whatsAppPara.id, mensaje);
            setWhatsAppPara(null);
          }}
          onGuardarPlantilla={guardarPlantilla}
          onCancelar={() => setWhatsAppPara(null)}
        />
      )}

      {pendienteDup && (
        <AlertaDuplicado
          nuevo={pendienteDup.datos}
          duplicado={pendienteDup.match.contacto}
          score={pendienteDup.match.score}
          onCancelar={() => setPendienteDup(null)}
          onCrearIgual={() => {
            const datos = pendienteDup.datos;
            setPendienteDup(null);
            guardar(datos, { ignorarDup: true });
          }}
          onFusionar={() => {
            const ok = fusionar(
              pendienteDup.match.contacto.id,
              pendienteDup.datos
            );
            setPendienteDup(null);
            if (ok) irContactos('todos');
          }}
        />
      )}

      {error && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg"
        >
          {error}
        </div>
      )}
    </div>
  );
}
