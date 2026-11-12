export const EXERCISE_EQUIPMENT = [
  { id: 'sin-material', label: 'Sin material' },
  { id: 'mancuernas', label: 'Mancuernas o pesa rusa' },
  { id: 'barra', label: 'Barra y discos' },
  { id: 'polea', label: 'Polea' },
  { id: 'barra-dominadas', label: 'Barra de dominadas' },
  { id: 'banda', label: 'Banda de asistencia' },
] as const

type Equipment = typeof EXERCISE_EQUIPMENT[number]['id']
interface Exercise {
  slug: string
  name: string
  pattern: string
  summary: string
  muscles: string[]
  imageAlt: string
  imageCaption: string
  steps: string[]
  checks: string[]
  variants: { name: string; description: string; equipment: Equipment[] }[]
  source: { title: string; url: string }
  aliases: string[]
}

export const COMMUNITY_EXERCISES: readonly Exercise[] = [
  {
    slug: 'sentadilla', name: 'Sentadilla libre y goblet', pattern: 'Dominante de rodilla',
    summary: 'Aprende a bajar y subir con control y conoce opciones sin carga externa o con una pesa delante del pecho.',
    muscles: ['Cuádriceps', 'Glúteos', 'Aductores y tronco como colaboradores'],
    imageAlt: 'Sentadilla libre de pie y en la posición baja, con cuádriceps y glúteos resaltados.',
    imageCaption: 'La ilustración muestra la variante libre. En goblet se sostiene una pesa delante del pecho.',
    steps: ['Coloca los pies a una anchura cómoda, con las puntas algo abiertas si te resulta natural.', 'Flexiona rodillas y caderas y baja entre los pies hasta una profundidad que controles. Mantén el apoyo del pie.', 'Empuja el suelo y vuelve a subir. La inclinación del tronco cambia según tu anatomía y la variante.'],
    checks: ['Perder el apoyo del pie o dejarse caer.', 'Forzar la misma profundidad que otra persona.', 'Añadir carga antes de poder repetir el recorrido con control.'],
    variants: [
      { name: 'Libre', description: 'Sin carga externa. Los brazos pueden servir de contrapeso.', equipment: ['sin-material'] },
      { name: 'Goblet', description: 'Sujeta una mancuerna o pesa rusa cerca del pecho.', equipment: ['mancuernas'] },
      { name: 'Hacia un cajón', description: 'Un cajón estable puede dar una referencia de profundidad; evita dejarte caer sobre él.', equipment: [] },
      { name: 'Postura más amplia', description: 'Ajusta separación y apertura a una postura que controles; no aísla un único músculo.', equipment: ['sin-material'] },
    ],
    source: { title: 'ACE · Bodyweight Squat', url: 'https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/' },
    aliases: ['squat', 'piernas', 'sentadillas', 'pesa rusa'],
  },
  {
    slug: 'sentadilla-barra', name: 'Sentadilla con barra', pattern: 'Dominante de rodilla',
    summary: 'Conoce la colocación de la barra y las diferencias entre sentadilla trasera y frontal.',
    muscles: ['Cuádriceps', 'Glúteos', 'Aductores y musculatura del tronco'],
    imageAlt: 'Sentadilla trasera con barra sobre la espalda alta, de pie y abajo, con piernas y glúteos resaltados.',
    imageCaption: 'Sentadilla trasera. La variante frontal coloca la barra delante de los hombros y no aparece en esta imagen.',
    steps: ['Usa un rack con seguros adecuados. Coloca la barra sobre la espalda alta, no sobre las vértebras del cuello, y sujétala con ambas manos.', 'Saca la barra con control y adopta una postura estable. Flexiona rodillas y caderas manteniendo el pie apoyado.', 'Sube sin perder el control del tronco. Para terminar, vuelve al rack y comprueba el apoyo en ambos soportes.'],
    checks: ['Sacar o devolver la barra sin comprobar los soportes.', 'Desplazar la carga más de lo que puedes controlar.', 'Forzar una postura de hombros o muñecas que molesta.'],
    variants: [
      { name: 'Trasera, barra alta', description: 'La barra descansa sobre la zona muscular de la espalda alta.', equipment: ['barra'] },
      { name: 'Frontal', description: 'La barra se apoya delante de los hombros; cambian la colocación y la demanda postural.', equipment: ['barra'] },
      { name: 'Goblet como alternativa', description: 'Una pesa delante del pecho permite practicar otra forma de cargar la sentadilla.', equipment: ['mancuernas'] },
    ],
    source: { title: 'ACE · Back Squat', url: 'https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/' },
    aliases: ['back squat', 'front squat', 'sentadillas', 'piernas', 'rack'],
  },
  {
    slug: 'zancadas', name: 'Zancadas', pattern: 'Trabajo de piernas con apoyos separados',
    summary: 'Compara la zancada sin peso y con mancuernas, y las opciones hacia delante, atrás o en posición fija.',
    muscles: ['Cuádriceps', 'Glúteos', 'Musculatura de cadera y tronco que estabiliza'],
    imageAlt: 'Zancadas sin carga en la fila superior y con mancuernas en la inferior, mostrando inicio y descenso.',
    imageCaption: 'Arriba, sin carga externa; abajo, con mancuernas. Se resalta parte del trabajo de muslos y glúteos.',
    steps: ['Desde una postura estable, da un paso amplio que permita separar los apoyos como dos raíles, no sobre una cuerda.', 'Flexiona ambas rodillas y desciende con control. Mantén el pie delantero apoyado y el tronco estable.', 'Empuja con la pierna delantera para volver. Si usas mancuernas, mantenlas a los lados con los brazos largos.'],
    checks: ['Cruzar los pies y perder el equilibrio.', 'Golpear el suelo con la rodilla trasera.', 'Usar una carga que obliga a impulsarse o retorcer el tronco.'],
    variants: [
      { name: 'Sin peso', description: 'Permite practicar el paso y el descenso sin carga externa.', equipment: ['sin-material'] },
      { name: 'Con mancuernas', description: 'Sujeta una a cada lado; la carga debe permitir controlar ambos apoyos.', equipment: ['mancuernas'] },
      { name: 'Hacia atrás', description: 'El paso se da hacia atrás. Ajusta longitud y recorrido sin forzar una postura idéntica a la frontal.', equipment: ['sin-material', 'mancuernas'] },
      { name: 'Posición fija o split squat', description: 'Los pies permanecen separados y se repite el descenso sin dar un paso cada vez.', equipment: ['sin-material', 'mancuernas'] },
    ],
    source: { title: 'ACE · Forward Lunge', url: 'https://www.acefitness.org/resources/everyone/exercise-library/94/forward-lunge/' },
    aliases: ['lunge', 'lunges', 'piernas', 'unilateral'],
  },
  {
    slug: 'flexiones', name: 'Flexiones en suelo', pattern: 'Empuje horizontal',
    summary: 'Apoyo de pies o rodillas, y variantes que cambian la exigencia del empuje.',
    muscles: ['Pectoral', 'Tríceps', 'Deltoides anterior', 'Tronco como estabilizador'],
    imageAlt: 'Flexiones con apoyo de pies arriba y de rodillas abajo, con pecho, hombros y brazos resaltados.',
    imageCaption: 'Arriba, apoyo de pies; abajo, apoyo de rodillas. En esta biblioteca, «fondos en suelo» se refiere a flexiones, no a fondos en banco o paralelas.',
    steps: ['Apoya las manos en una posición cómoda, aproximadamente a la anchura de hombros o algo más abiertas.', 'Con pies apoyados, alinea cabeza, tronco y piernas. Con rodillas apoyadas, mantén alineados hombros, caderas y rodillas.', 'Acerca el pecho al suelo flexionando los codos y empuja para volver, sin dejar caer la pelvis.'],
    checks: ['Elevar o hundir la cadera para completar la repetición.', 'Forzar la posición de muñecas o codos.', 'Buscar más recorrido del que puedes controlar.'],
    variants: [
      { name: 'Apoyo de rodillas', description: 'Acorta la palanca del cuerpo; procura mover tronco y caderas como una pieza.', equipment: ['sin-material'] },
      { name: 'Apoyo de pies', description: 'Versión convencional con control del tronco durante todo el movimiento.', equipment: ['sin-material'] },
      { name: 'Manos elevadas', description: 'Un apoyo alto y fijo suele facilitar el empuje. Comprueba que no pueda desplazarse.', equipment: [] },
      { name: 'Agarre más cerrado', description: 'Acerca algo las manos sin forzar articulaciones; cambia la demanda del empuje.', equipment: ['sin-material'] },
    ],
    source: { title: 'ACE · Push-up', url: 'https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/' },
    aliases: ['push up', 'push-up', 'fondos', 'pecho', 'brazos'],
  },
  {
    slug: 'peso-muerto', name: 'Peso muerto', pattern: 'Bisagra de cadera',
    summary: 'Distingue el convencional desde el suelo del rumano, que comienza de pie.',
    muscles: ['Glúteos', 'Isquiosurales', 'Extensores de espalda', 'Cuádriceps y agarre según variante'],
    imageAlt: 'Peso muerto convencional con barra desde el suelo y de pie, con glúteos, muslos y espalda resaltados.',
    imageCaption: 'La secuencia representa el convencional. En el rumano se empieza de pie y no es necesario tocar el suelo.',
    steps: ['En el convencional, acerca la barra al mediopié y flexiona caderas y rodillas para sujetarla con brazos largos.', 'Empuja el suelo y extiende caderas y rodillas llevando la carga cerca del cuerpo, con el tronco firme.', 'Termina erguido, sin echarte atrás, y baja con control. Ajusta la altura inicial si no puedes controlar el recorrido.'],
    checks: ['Despegar la carga con un tirón o doblando los codos.', 'Alejar demasiado la carga del cuerpo.', 'Insistir en llegar al suelo perdiendo el control del gesto.'],
    variants: [
      { name: 'Convencional', description: 'Empieza desde el suelo, con las manos por fuera de las piernas.', equipment: ['barra'] },
      { name: 'Rumano', description: 'Desde de pie, lleva la cadera atrás con rodillas ligeramente flexionadas; no exige tocar el suelo.', equipment: ['barra', 'mancuernas'] },
      { name: 'Mancuernas o pesa rusa', description: 'Permiten cambiar material y punto de inicio con apoyos firmes cuando hacen falta.', equipment: ['mancuernas'] },
      { name: 'Sumo o barra hexagonal', description: 'Cambian postura y agarre; no son automáticamente más fáciles que el convencional.', equipment: ['barra'] },
    ],
    source: { title: 'ACE · Deadlift', url: 'https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/' },
    aliases: ['deadlift', 'bisagra', 'rumano', 'posterior'],
  },
  {
    slug: 'dominadas', name: 'Dominadas', pattern: 'Tracción vertical',
    summary: 'Aprende el recorrido y compara agarres y formas de asistencia.',
    muscles: ['Dorsal ancho', 'Flexores del codo', 'Musculatura escapular', 'Tronco como estabilizador'],
    imageAlt: 'Dominada vista desde atrás, en suspensión y arriba, con dorsales y brazos resaltados.',
    imageCaption: 'La imagen muestra una dominada con agarre prono. La asistencia y los otros agarres se describen en el texto.',
    steps: ['Usa una barra firme y adecuada para tu peso, con un agarre que puedas mantener sin molestias.', 'Desde una suspensión controlada, tira llevando los codos hacia abajo, sin impulsarte con balanceos.', 'Sube hasta un recorrido que controles y desciende sin dejarte caer. Evita adelantar la barbilla para aparentar más altura.'],
    checks: ['Usar una barra o anclaje que no conoces.', 'Confundir balanceo con una repetición controlada.', 'Soltar de golpe la tensión al bajar.'],
    variants: [
      { name: 'Agarre prono', description: 'Palmas orientadas hacia fuera; es la variante ilustrada.', equipment: ['barra-dominadas'] },
      { name: 'Supino o neutro', description: 'Palmas hacia ti o enfrentadas si la barra dispone de asas adecuadas.', equipment: ['barra-dominadas'] },
      { name: 'Con asistencia', description: 'Una máquina o una banda puede ayudar. Con banda se necesitan también barra y colocación seguras.', equipment: ['barra-dominadas', 'banda'] },
      { name: 'Jalón como alternativa', description: 'Permite practicar otra tracción vertical con polea; no es una dominada.', equipment: ['polea'] },
    ],
    source: { title: 'ACE · Chin-ups, agarre supino', url: 'https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/' },
    aliases: ['pull up', 'pull-up', 'chin up', 'jalon', 'espalda'],
  },
  {
    slug: 'remos', name: 'Remo con mancuerna o polea', pattern: 'Tracción horizontal',
    summary: 'Compara el remo unilateral con apoyo y el remo sentado en polea.',
    muscles: ['Dorsal ancho', 'Romboides y trapecio', 'Deltoides posterior', 'Flexores del codo'],
    imageAlt: 'Remo con mancuerna apoyado en banco a la izquierda y remo sentado en polea a la derecha, con espalda y brazos resaltados.',
    imageCaption: 'Dos variantes: mancuerna con apoyo y polea sentada. La imagen no indica un porcentaje de activación muscular.',
    steps: ['Con mancuerna, apoya una mano y una rodilla en un banco estable. Mantén el tronco controlado y el brazo de carga extendido hacia abajo.', 'Lleva el codo hacia atrás, acercando la mancuerna al costado sin girar el tronco para subirla.', 'Desciende con control. En polea, ajusta asiento y apoyos y tira sin convertir el movimiento en un balanceo de todo el cuerpo.'],
    checks: ['Girar el tronco para mover más carga.', 'Dar un tirón con el cuerpo en cada repetición.', 'Forzar el codo más atrás de lo que permite un recorrido controlado.'],
    variants: [
      { name: 'Mancuerna con apoyo', description: 'El banco facilita mantener una referencia estable mientras trabaja un brazo.', equipment: ['mancuernas'] },
      { name: 'Polea sentada', description: 'Usa apoyos adecuados y un agarre que permita controlar el recorrido.', equipment: ['polea'] },
      { name: 'Pecho apoyado', description: 'Un banco inclinado puede limitar el balanceo del tronco.', equipment: ['mancuernas'] },
      { name: 'Barra', description: 'Exige sostener la inclinación del tronco mientras tiras de la carga.', equipment: ['barra'] },
    ],
    source: { title: 'ACE · Single-arm Row', url: 'https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/' },
    aliases: ['remo', 'row', 'espalda', 'polea', 'mancuerna'],
  },
]

export function getCommunityExercise(slug: string) {
  return COMMUNITY_EXERCISES.find(exercise => exercise.slug === slug)
}

export function getExerciseSummaries() {
  return COMMUNITY_EXERCISES.map(exercise => ({
    slug: exercise.slug, name: exercise.name, pattern: exercise.pattern, summary: exercise.summary,
    imageAlt: exercise.imageAlt, muscles: exercise.muscles,
    equipment: [...new Set(exercise.variants.flatMap(variant => variant.equipment))],
    searchText: [exercise.name, exercise.pattern, exercise.summary, ...exercise.muscles, ...exercise.aliases, ...exercise.variants.map(variant => variant.name), ...exercise.variants.flatMap(variant => variant.equipment.map(id => EXERCISE_EQUIPMENT.find(item => item.id === id)?.label ?? ''))].join(' '),
  }))
}
