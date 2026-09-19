import { obtenerDB, persistir } from '../db/database.js';
import { actualizarContacto, eliminarContacto } from '../db/contactosRepo.js';

export function fusionarContactos(idBase, idDuplicado, datos) {
  actualizarContacto(idBase, datos);
  obtenerDB().run(
    'UPDATE mensajes SET contacto_id = ? WHERE contacto_id = ?',
    [idBase, idDuplicado]
  );
  eliminarContacto(idDuplicado);
  persistir();
}
