import { varsContacto } from './plantilla.js';

export function sugerenciasLocales(contacto) {
  const { nombre, grupo } = varsContacto(contacto);
  const grupoTxt = grupo || 'contacto';
  const notas = (contacto.notas || '').trim();
  const extra = notas ? ` Sobre: ${notas}.` : '';

  return [
    {
      tono: 'formal',
      mensaje: `Estimado/a ${nombre}: me comunico respecto a nuestro contacto en ${grupoTxt}.${extra} Quedo atento/a a su respuesta.`,
    },
    {
      tono: 'cercano',
      mensaje: `Hola ${nombre}! Te escribo desde la agenda.${extra} Como estas?`,
    },
    {
      tono: 'breve',
      mensaje: `Hola ${nombre}, te contacto por ${grupoTxt}.${extra} Avísame.`,
    },
  ];
}

function parsearRespuesta(texto) {
  const limpio = String(texto)
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  const data = JSON.parse(limpio);
  if (!Array.isArray(data) || data.length < 3) {
    throw new Error('Formato inesperado');
  }
  return data.slice(0, 3).map((item) => ({
    tono: item.tono || 'sugerido',
    mensaje: item.mensaje || '',
  }));
}

export async function sugerirMensajes(contacto, { fetchFn = fetch } = {}) {
  const endpoint = import.meta.env?.VITE_LLM_URL;
  const apiKey = import.meta.env?.VITE_LLM_KEY;

  if (!endpoint || !apiKey) {
    return { fuente: 'local', sugerencias: sugerenciasLocales(contacto) };
  }

  const v = varsContacto(contacto);
  const prompt =
    'Responde unicamente con un arreglo JSON de tres objetos { "tono": string, "mensaje": string } ' +
    'con tonos formal, cercano y breve. Sin texto adicional. ' +
    `Contacto: nombre=${v.nombre}, grupo=${v.grupo}, telefono=${v.telefono}, notas=${contacto.notas || ''}.`;

  try {
    const res = await fetchFn(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const texto =
      json.choices?.[0]?.message?.content ||
      json.content ||
      JSON.stringify(json);
    return { fuente: 'llm', sugerencias: parsearRespuesta(texto) };
  } catch (e) {
    return {
      fuente: 'local',
      error: String(e.message || e),
      sugerencias: sugerenciasLocales(contacto),
    };
  }
}
