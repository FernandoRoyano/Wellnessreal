// ============================================================
//  Método BASE · Estructura del programa generado
//  Tipos TypeScript + JSON Schema para structured output
// ============================================================
//  El JSON Schema de abajo es lo que la IA está OBLIGADA a
//  devolver (vía tool use forzado). Coincide 1:1 con la
//  estructura del documento de cliente del Método BASE.
// ============================================================

export interface Ejercicio {
  nombre: string        // nombre en español (inglés entre paréntesis la 1ª vez)
  series_reps: string   // ej. "3 × 8-10"
  rir: string           // ej. "2-3" o "—"
  alternativa: string   // ejercicio alternativo
  nota?: string         // indicación opcional
}

export interface DiaEntrenamiento {
  nombre: string        // "Día A", "Día B"...
  ejercicios: Ejercicio[]
}

export interface Programa {
  mensaje_bienvenida: string

  punto_partida: {
    objetivo_principal: string
    objetivos_secundarios: string[]
    donde_entrena: string
    dias_tiempo: string
    consideraciones: string
  }

  entrenamiento: {
    introduccion: string   // cómo funciona, en "tú"
    regla_rir: string
    progresion: string
    calentamiento: string[]
    dias: DiaEntrenamiento[]
    vuelta_calma: string[]
  }

  nutricion: {
    introduccion: string
    reglas: string[]       // las reglas clave, en "tú"
    dia_tipo: string[]     // ejemplo de día
    notas: string
  }

  seguimiento: {
    introduccion: string
    que_registrar: string[]
  }
}

// ------------------------------------------------------------
//  JSON Schema para la herramienta (tool use forzado)
// ------------------------------------------------------------
export const PROGRAMA_JSON_SCHEMA = {
  type: 'object',
  properties: {
    mensaje_bienvenida: { type: 'string', description: 'Mensaje breve y cercano de bienvenida, en tú, con el tono WellnessReal.' },
    punto_partida: {
      type: 'object',
      properties: {
        objetivo_principal: { type: 'string' },
        objetivos_secundarios: { type: 'array', items: { type: 'string' } },
        donde_entrena: { type: 'string' },
        dias_tiempo: { type: 'string' },
        consideraciones: { type: 'string', description: "Lesiones o limitaciones a tener en cuenta. Si no hay, indica 'Sin limitaciones reportadas'." },
      },
      required: ['objetivo_principal', 'objetivos_secundarios', 'donde_entrena', 'dias_tiempo', 'consideraciones'],
    },
    entrenamiento: {
      type: 'object',
      properties: {
        introduccion: { type: 'string', description: 'Cómo funciona la semana, en tú, sin jerga.' },
        regla_rir: { type: 'string' },
        progresion: { type: 'string' },
        calentamiento: { type: 'array', items: { type: 'string' } },
        dias: {
          type: 'array',
          description: 'Tantos días como pueda entrenar el cliente. Cada grupo muscular idealmente 2x/semana.',
          items: {
            type: 'object',
            properties: {
              nombre: { type: 'string' },
              ejercicios: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', description: 'Nombre en español, con el inglés entre paréntesis la primera vez.' },
                    series_reps: { type: 'string' },
                    rir: { type: 'string', description: 'Ej. "2-3" o "—" cuando no aplique.' },
                    alternativa: { type: 'string' },
                    nota: { type: 'string' },
                  },
                  required: ['nombre', 'series_reps', 'rir', 'alternativa'],
                },
              },
            },
            required: ['nombre', 'ejercicios'],
          },
        },
        vuelta_calma: { type: 'array', items: { type: 'string' } },
      },
      required: ['introduccion', 'regla_rir', 'progresion', 'calentamiento', 'dias', 'vuelta_calma'],
    },
    nutricion: {
      type: 'object',
      properties: {
        introduccion: { type: 'string' },
        reglas: { type: 'array', items: { type: 'string' } },
        dia_tipo: { type: 'array', items: { type: 'string' } },
        notas: { type: 'string' },
      },
      required: ['introduccion', 'reglas', 'dia_tipo', 'notas'],
    },
    seguimiento: {
      type: 'object',
      properties: {
        introduccion: { type: 'string' },
        que_registrar: { type: 'array', items: { type: 'string' } },
      },
      required: ['introduccion', 'que_registrar'],
    },
  },
  required: ['mensaje_bienvenida', 'punto_partida', 'entrenamiento', 'nutricion', 'seguimiento'],
} as const

// ------------------------------------------------------------
//  Ajuste quirúrgico: devuelve el programa COMPLETO actualizado
//  (no un diff) + un resumen claro de qué cambió y por qué.
// ------------------------------------------------------------
export interface Ajuste {
  resumen_cambios: string[]
  programa: Programa
}

export const AJUSTE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    resumen_cambios: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Lista breve de qué has cambiado respecto a la versión anterior y por qué. En tú, claro y concreto (ej. "Subo press banca a 4 series porque la semana pasada te sobró energía").',
    },
    programa: PROGRAMA_JSON_SCHEMA,
  },
  required: ['resumen_cambios', 'programa'],
} as const
