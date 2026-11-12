interface WorkoutExercise {
  slug: string
  variant: string
  repetitions: string
  note: string
  optional?: boolean
}

interface ExampleWorkout {
  id: string
  title: string
  equipment: string
  description: string
  exercises: WorkoutExercise[]
}

export const COMMUNITY_WORKOUTS: readonly ExampleWorkout[] = [
  {
    id: 'mancuernas', title: 'En casa con mancuernas',
    equipment: 'Mancuernas, espacio libre y un banco o apoyo firme que no se desplace.',
    description: 'Cuatro movimientos para practicar piernas, cadera, empuje y tracción. Si aún no tienes mancuernas, puedes practicar sentadilla y flexiones, pero este ejemplo completo sí necesita carga para el remo y la bisagra.',
    exercises: [
      { slug: 'sentadilla', variant: 'Sentadilla goblet', repetitions: '8–12 repeticiones', note: 'Empieza sin carga si estás aprendiendo; añade una mancuerna delante del pecho cuando controles el movimiento.' },
      { slug: 'flexiones', variant: 'Flexiones con manos elevadas o rodillas', repetitions: '6–12 repeticiones', note: 'Elige un apoyo fijo o la versión de rodillas según tu control. No necesitas empezar con apoyo de pies.' },
      { slug: 'peso-muerto', variant: 'Peso muerto rumano con mancuernas', repetitions: '8–12 repeticiones', note: 'Empieza de pie y lleva la cadera atrás. El recorrido termina donde puedas mantener el control, aunque las pesas no lleguen al suelo.' },
      { slug: 'remos', variant: 'Remo con mancuerna y apoyo', repetitions: '8–12 repeticiones por lado', note: 'Completa ambos lados para contar una serie. Ajusta la carga para tirar sin girar el tronco.' },
    ],
  },
  {
    id: 'gimnasio', title: 'En el gimnasio',
    equipment: 'Mancuernas, polea, banco y, si eliges esa variante, barra y discos.',
    description: 'Otra forma de cubrir los mismos movimientos con apoyos y cargas diferentes. El press vertical es opcional; añade variedad sin obligarte a alargar cada sesión.',
    exercises: [
      { slug: 'zancadas', variant: 'Split squat sin peso o con mancuernas', repetitions: '8–12 repeticiones por lado', note: 'Mantén los pies en posición fija. Si el equilibrio limita más que las piernas, prueba la sentadilla goblet de la biblioteca.' },
      { slug: 'flexiones', variant: 'Flexiones con manos elevadas o pies', repetitions: '6–12 repeticiones', note: 'Ajusta la altura del apoyo antes de intentar una variante que no puedes controlar.' },
      { slug: 'peso-muerto', variant: 'Peso muerto rumano con barra o mancuernas', repetitions: '8–12 repeticiones', note: 'Usa la variante que ya conoces. Cambiar de mancuernas a barra exige volver a ajustar la carga.' },
      { slug: 'remos', variant: 'Remo sentado en polea', repetitions: '8–12 repeticiones', note: 'Ajusta asiento y apoyos. La polea no necesita acompañarse de un balanceo del tronco.' },
      { slug: 'press-hombros-mancuernas', variant: 'Press de hombros sentado', repetitions: '8–12 repeticiones', note: 'Solo si conoces la ejecución y queda margen de esfuerzo y tiempo. También puedes consultar el press militar con barra en la biblioteca.', optional: true },
    ],
  },
]
