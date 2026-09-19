## Reflexion etica — Redaccion asistida (E12)

Al usar un modelo de lenguaje para sugerir mensajes, la agenda envia (o podria enviar) datos del contacto a un servicio externo.

### Que datos son aceptables enviar

- Nombre de pila y categoria/grupo, si el usuario lo autoriza de forma explicita.
- Notas solo cuando no contengan datos sensibles (salud, dinero exacto, ubicacion, documentos).

### Que no conviene enviar

- Numero de telefono completo, correo, direccion o identificadores personales.
- Mensajes previos, historial de cobranza o cualquier dato financiero detallado.
- Informacion de terceros mencionada en las notas.

### Buenas practicas en esta app

1. El boton «Sugerir mensaje» es optativo: el usuario decide cuándo pedirlo.
2. Si no hay `VITE_LLM_URL` / `VITE_LLM_KEY`, las sugerencias se generan en local y no salen del navegador.
3. El usuario siempre puede editar el texto antes de abrir WhatsApp.
4. Ante error del modelo, se muestra aviso y se usa respaldo local; la app no se rompe.

### Conclusion

Minimizar datos enviados, preferir procesamiento local cuando sea posible, y dejar el control final del mensaje en manos del usuario.
