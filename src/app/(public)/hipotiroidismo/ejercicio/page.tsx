import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/common/Container'
import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'
import styles from './guide.module.css'

export const metadata = buildMetadata({
  title: 'Ejercicio con hipotiroidismo: fuerza y cardio',
  description: 'Guía práctica para entrenar con hipotiroidismo: ejemplo de semana, ejercicios en casa y gimnasio, progresión y ajustes cuando cambia tu energía.',
  path: '/hipotiroidismo/ejercicio',
  keywords: ['ejercicio hipotiroidismo', 'entrenamiento hipotiroidismo', 'fuerza hipotiroidismo'],
})

const config: TopicHubConfig = {
  eyebrow: 'Hipotiroidismo y entrenamiento', title: 'Ejercicio con hipotiroidismo:', highlightedTitle: 'una dosis que puedas recuperar',
  introduction: 'Cómo combinar fuerza, cardio y movimiento cotidiano con hipotiroidismo o Hashimoto. Con un ejemplo de semana y alternativas para que el plan encaje en tu punto de partida.',
  answer: 'Si tu situación clínica permite hacer ejercicio, dos sesiones de fuerza separadas y paseos tolerables pueden ser un punto de partida. Empieza con una dosis que puedas recuperar, registra cómo respondes y aumenta poco a poco. El entrenamiento acompaña tu salud; no sustituye el tratamiento.', path: '/hipotiroidismo/ejercicio',
  sections: [
    { title: 'Prioriza la fuerza', body: 'Trabaja los patrones principales con ejercicios estables, esfuerzo suficiente y una progresión que puedas registrar.' },
    { title: 'Añade cardio', body: 'Caminar, bicicleta u otra modalidad tolerable mejora capacidad. No necesitas usarlo como castigo por comer.' },
    { title: 'Regula la dosis', body: 'Un día de menos energía puede requerir menos series, no necesariamente abandonar toda la semana.' },
  ],
  guides: [
    { href: '/blog/mejor-ejercicio-hipotiroidismo', title: '¿Cuál es el mejor ejercicio?', description: 'Beneficios, dosis y criterios para elegir fuerza y cardio.' },
    { href: '/blog/agujetas-cansancio-debilidad-tiroides', title: 'Agujetas, cansancio o debilidad', description: 'Cómo distinguir patrones y cuándo conviene consultar.' },
    { href: '/blog/rutina-30-minutos-en-casa', title: 'Rutina de 30 minutos', description: 'Una plantilla adaptable para entrenar fuerza en casa.' },
    { href: '/blog/rir-rpe-autoregular-entrenamiento', title: 'Regular el esfuerzo con RIR y RPE', description: 'Dos herramientas para ajustar sin improvisar.' },
  ],
  faqs: [
    { question: '¿Cuántos días debo entrenar con hipotiroidismo?', answer: 'Dos sesiones de fuerza en días separados pueden ser un inicio si tu situación clínica y tu recuperación lo permiten. Si es demasiado, empieza con menos. La frecuencia se ajusta a tu experiencia, disponibilidad y respuesta.' },
    { question: '¿Puedo entrenar fuerza si tengo Hashimoto?', answer: 'El diagnóstico por sí solo no determina qué ejercicios puedes hacer. La actividad se adapta a tu situación clínica, síntomas y experiencia, siguiendo las indicaciones de tu equipo sanitario. El entrenamiento no sustituye el tratamiento ni justifica cambiar la medicación.' },
    { question: '¿El cardio o el HIIT son malos para el hipotiroidismo?', answer: 'El hipotiroidismo no implica prohibir el cardio. Caminar o ir en bicicleta permiten empezar con una intensidad fácil de ajustar. El HIIT no es obligatorio; si te interesa, valora primero tu situación clínica, tu base de entrenamiento y cómo recuperas.' },
    { question: '¿Debo entrenar aunque esté cansada?', answer: 'Un día de menos energía puede permitir una sesión más corta o ligera. Si la fatiga es intensa, nueva, persiste o empeora con el esfuerzo, evita forzarte y consulta. No atribuyas automáticamente cualquier cansancio a la tiroides.' },
    { question: '¿Puedo entrenar en casa sin gimnasio?', answer: 'Sí. Una silla estable, una pared y, si dispones de ellas, gomas o mancuernas permiten adaptar movimientos básicos. Necesitas una dificultad adecuada y una forma de progresar; el lugar no determina por sí solo la calidad del plan.' },
    { question: '¿El ejercicio permite dejar la levotiroxina?', answer: 'No debes reducir ni suspender la levotiroxina por empezar a entrenar o por notar más energía. El diagnóstico, las analíticas y cualquier cambio del tratamiento corresponden a tu equipo sanitario.' },
  ],
  cta: { title: '¿Quieres acompañamiento para llevarlo a tu semana?', description: 'Conoce Método BASE Tiroides: 12 semanas de fuerza, hábitos y seguimiento con Fernando Royano. Revisa qué incluye y solicita plaza si encaja contigo. No sustituye tu seguimiento sanitario.', href: '/metodo-tiroides', label: 'Ver el programa y cómo empezar' },
}

const weekExample = [
  { day: 'Lunes', activity: 'Fuerza · 25–35 min', detail: 'Una sesión de cuerpo completo, con pocas series y movimientos que puedas controlar.' },
  { day: 'Martes y miércoles', activity: 'Movimiento cotidiano', detail: 'Un paseo de 10–20 minutos si lo toleras, desplazamientos a pie o descanso según cómo recuperes.' },
  { day: 'Jueves', activity: 'Fuerza · 25–35 min', detail: 'Repite los mismos patrones. Usa el registro del lunes para mantener o ajustar la dificultad.' },
  { day: 'Viernes a domingo', activity: 'Paseos y recuperación', detail: 'Reparte el movimiento en ratos que encajen contigo. No acumules sesiones para compensar las que no pudiste hacer.' },
]

const movementExamples = [
  { pattern: 'Sentarte y levantarte', home: 'Levantarte de una silla firme, con apoyo de manos si lo necesitas.', gym: 'Sentadilla a un banco o prensa ajustada a tu movilidad.' },
  { pattern: 'Mover la cadera', home: 'Puente de glúteos o bisagra de cadera con una carga ligera si conoces el movimiento.', gym: 'Puente de glúteos con carga o peso muerto con mancuernas, si dominas la técnica.' },
  { pattern: 'Empujar', home: 'Flexiones contra una pared o una superficie firme y estable.', gym: 'Press de pecho en máquina o con mancuernas.' },
  { pattern: 'Tirar hacia ti', home: 'Remo con mancuerna y apoyo estable, o con una goma fijada en un anclaje adecuado.', gym: 'Remo en polea o en máquina.' },
]

export default function EjercicioHipotiroidismoPage() {
  return (
    <TopicHubPage config={config}>
      <section className="bg-brand-deep py-fluid-xl" aria-label="Guía práctica de entrenamiento">
        <Container>
          <article className={styles.guide}>
            <header className={styles.byline}>
              <p>Por <Link href="/sobre-mi">Fernando Royano</Link> · Graduado en Ciencias de la Actividad Física y del Deporte.</p>
              <p>Actualizada el <time dateTime="2026-11-04">4 de noviembre de 2026</time>.</p>
            </header>

            <nav className={styles.contents} aria-label="Índice de la guía de ejercicio">
              <p>Ve a lo que necesitas</p>
              <ol>
                <li><a href="#antes-de-empezar">Antes de empezar</a></li>
                <li><a href="#semana-ejemplo">Ejemplo de semana</a></li>
                <li><a href="#casa-o-gimnasio">Ejercicios y músculos</a></li>
                <li><a href="#ajustar-esfuerzo">Ajustar y progresar</a></li>
                <li><a href="#cuando-consultar">Cuándo parar y consultar</a></li>
                <li><a href="#fuentes">Fuentes y alcance</a></li>
              </ol>
            </nav>

            <section id="antes-de-empezar" className={styles.chapter}>
              <span className="eyebrow">Tu punto de partida</span>
              <h2>Antes de elegir ejercicios, mira cómo estás ahora</h2>
              <p>El diagnóstico de hipotiroidismo no describe por sí solo tu capacidad para entrenar. Importan tu seguimiento sanitario, los síntomas actuales, cuánto te movías antes y cómo recuperas. Si acabas de recibir el diagnóstico, tienes síntomas importantes o alguna restricción médica, aclara primero con tu equipo sanitario qué actividad es adecuada.</p>
              <p>El <a href="#fuente-niddk">NIDDK explica que el diagnóstico y el tratamiento requieren valoración y seguimiento clínicos</a>. Notarte cansada no basta para saber cómo está tu tiroides, y entrenar más no es una forma de ajustar la medicación.</p>
              <p>Para organizar el entrenamiento, empieza por tres datos: cuántos días tienes de verdad, qué movimientos conoces y qué cantidad de actividad puedes repetir sin que el cansancio te desordene el resto de la semana.</p>
            </section>

            <section id="semana-ejemplo" className={styles.chapter}>
              <span className="eyebrow">Un ejemplo, no una obligación</span>
              <h2>Cómo podría ser una semana de inicio</h2>
              <p>Este ejemplo está pensado para una persona adulta que puede hacer ejercicio y retoma la fuerza con poca experiencia. Las duraciones son orientativas: puedes empezar por sesiones más cortas y distribuirlas de otra manera.</p>
              <ol className={styles.week}>
                {weekExample.map((item) => (
                  <li key={item.day}>
                    <span className={styles.day}>{item.day}</span>
                    <h3>{item.activity}</h3>
                    <p>{item.detail}</p>
                  </li>
                ))}
              </ol>
              <p>Si hoy puedes caminar cinco minutos con comodidad, ese puede ser tu inicio. Las <a href="#fuente-oms">recomendaciones de actividad física de la OMS</a> sirven como referencia general; tu primera semana debe ajustarse a lo que puedes hacer ahora.</p>
              <p>El cardio también tiene sitio: caminar, pedalear o nadar son opciones si encajan contigo. Para una intensidad moderada, <a href="#fuente-intensidad">poder hablar, pero no cantar, mientras te mueves</a> es una referencia práctica. Si el ritmo te obliga a ir ahogada, bájalo. No necesitas intervalos intensos para que la actividad cuente.</p>
            </section>

            <section id="casa-o-gimnasio" className={styles.chapter}>
              <span className="eyebrow">Los mismos patrones, distinto material</span>
              <h2>Una sesión de fuerza en casa o en el gimnasio</h2>
              <p>Dedica unos minutos a moverte y ensayar cada ejercicio sin carga o con una carga fácil. Después, elige una variante de cada patrón que puedas realizar con control y sin dolor preocupante. Si un movimiento es nuevo, pide ayuda para aprenderlo antes de hacerlo más difícil.</p>
              <figure className={styles.anatomy} aria-labelledby="musculos-ejercicios">
                <h3 id="musculos-ejercicios">Qué músculos trabaja cada movimiento</h3>
                <Image
                  src="/guides/ejercicio-hipotiroidismo/musculos-patrones-fuerza-v1.webp"
                  alt="Cuatro ejercicios con músculos destacados: sentadilla con cuádriceps y glúteos; puente con glúteos e isquiotibiales; flexión en pared con pecho, hombros y tríceps; remo con dorsal ancho y espalda media."
                  width={1086}
                  height={1448}
                  sizes="(max-width: 896px) calc(100vw - 2rem), 832px"
                  className={styles.anatomyImage}
                />
                <ol className={styles.muscleLegend}>
                  <li><strong>Sentadilla.</strong> Cuádriceps, en la parte anterior del muslo, y glúteo mayor.</li>
                  <li><strong>Puente de glúteos.</strong> Glúteo mayor, con participación de los isquiotibiales, en la parte posterior del muslo.</li>
                  <li><strong>Flexión en pared.</strong> Pectoral mayor, deltoides anterior y tríceps: pecho, parte delantera del hombro y parte posterior del brazo.</li>
                  <li><strong>Remo con apoyo.</strong> Dorsal ancho y musculatura de la espalda media, como el trapecio medio. Los flexores del codo también ayudan.</li>
                </ol>
                <figcaption>
                  Ilustración anatómica generada con IA. El rojo destaca algunas zonas implicadas; no mide su activación ni muestra todos los músculos que participan.
                  {' '}<a href="/guides/ejercicio-hipotiroidismo/musculos-patrones-fuerza-v1.webp" target="_blank" rel="noopener noreferrer">Ampliar la lámina (nueva pestaña)</a>.
                </figcaption>
              </figure>
              <p className={styles.movementSources}>Referencias para los movimientos: <a href="https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/">sentadilla</a> y <a href="https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/">puente de glúteos, de ACE</a>; <a href="https://www.nasm.org/resource-center/exercise-library/push-up">flexiones, de NASM</a>; <a href="https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/seated-row/vid-20084669">remo, de Mayo Clinic</a>.</p>
              <dl className={styles.movements}>
                {movementExamples.map((item) => (
                  <div key={item.pattern}>
                    <dt>{item.pattern}</dt>
                    <dd><strong>En casa:</strong> {item.home}</dd>
                    <dd><strong>En gimnasio:</strong> {item.gym}</dd>
                  </div>
                ))}
              </dl>
              <p>Como ejemplo de aprendizaje, puedes probar una serie de 6–10 repeticiones por movimiento. Si resulta tolerable y recuperas bien, valora una segunda serie en sesiones posteriores. El número se adapta: no es una dosis específica para la tiroides.</p>
              <p>Descansa entre series hasta poder repetir el movimiento con control; uno o dos minutos pueden servir de referencia, y puedes necesitar más. Termina con la sensación de que podrías hacer unas dos o tres repeticiones adicionales sin perder la técnica. Eso significa dejar <Link href="/blog/rir-rpe-autoregular-entrenamiento">repeticiones en reserva, o RIR</Link>.</p>
              <p>Si no tienes material seguro para un remo, no improvises anclajes en muebles o puertas. Adapta la sesión al material disponible y busca una alternativa con ayuda profesional.</p>
            </section>

            <section id="ajustar-esfuerzo" className={styles.chapter}>
              <span className="eyebrow">Mantener, reducir o progresar</span>
              <h2>Qué cambiar cuando cambia tu energía</h2>
              <p>Un mal día no obliga a rehacer todo el plan. Si has dormido poco o notas menos energía, empieza por el calentamiento y observa cómo respondes. No utilices esta prueba para insistir si aparecen síntomas nuevos o preocupantes.</p>
              <ul className={styles.decisions}>
                <li><strong>Mantén</strong> si los movimientos salen con control, el esfuerzo es el previsto y recuperas de forma parecida a otras sesiones.</li>
                <li><strong>Reduce</strong> ante un día puntual de menos energía: por ejemplo, haz una serie en lugar de dos, usa una variante más fácil o acorta el paseo. También puedes descansar.</li>
                <li><strong>Progresa</strong> cuando varias sesiones similares resultan manejables y recuperas bien. Añade una repetición o un pequeño aumento de carga; observa la respuesta antes de cambiar otra cosa.</li>
              </ul>
              <p>Por ejemplo: si haces ocho repeticiones con control y margen durante varias sesiones, puedes probar nueve con la misma carga. Si esa semana has recuperado peor, mantener ocho también puede ser una buena decisión.</p>
              <p>Registra el ejercicio, la carga o variante, las repeticiones y cómo te encuentras al día siguiente. Puedes mejorar haciendo el mismo trabajo con más control, caminando con mayor comodidad o sosteniendo la rutina. El peso corporal no cuenta toda la historia.</p>
            </section>

            <section id="cuando-consultar" className={styles.chapter}>
              <span className="eyebrow">Escuchar la respuesta</span>
              <h2>Cuándo parar y consultar</h2>
              <p>Las agujetas tras un ejercicio nuevo y una fatiga intensa que empeora no se gestionan igual. Si aparece debilidad progresiva, dolor que preocupa, palpitaciones o un cansancio nuevo, persistente o desproporcionado, detén la sesión y consulta antes de insistir.</p>
              <p>Ante dolor en el pecho, desmayo o dificultad importante para respirar, busca atención urgente. No esperes a ver si reducir las series lo resuelve.</p>
              <p>Si el esfuerzo te deja mucho peor durante días, no aumentes la carga para intentar acostumbrarte. Conviene valorar qué ocurre. Esta guía no permite identificar la causa de los síntomas.</p>
              <p>En <Link href="/blog/agujetas-cansancio-debilidad-tiroides">agujetas, cansancio o debilidad</Link> tienes una explicación más detallada de estas diferencias.</p>
            </section>

            <section id="fuentes" className={styles.chapter}>
              <span className="eyebrow">De dónde sale esta guía</span>
              <h2>Fuentes y alcance del ejemplo</h2>
              <p>La selección de movimientos, la semana y los ajustes son ejemplos de organización del entrenamiento. No proceden de un protocolo que funcione igual para todas las personas con hipotiroidismo.</p>
              <p>Un <a href="#fuente-ensayo">ensayo de 2023 con 60 mujeres que recibían levotiroxina</a> observó mejoras en capacidad física y calidad de vida con diferentes modalidades de ejercicio. Su tamaño y sus participantes limitan la generalización: no demuestra que esta semana concreta sirva para cualquier persona ni que el ejercicio sustituya el tratamiento.</p>
              <ol className={styles.sources}>
                <li id="fuente-niddk"><a href="https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism">NIDDK · Hipotiroidismo: síntomas, diagnóstico y tratamiento.</a> Contexto clínico; las decisiones sobre medicación corresponden al equipo sanitario.</li>
                <li id="fuente-oms"><a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity">Organización Mundial de la Salud · Actividad física.</a> Beneficios y recomendaciones generales de actividad; no es una pauta específica para hipotiroidismo.</li>
                <li id="fuente-intensidad"><a href="https://www.cdc.gov/physical-activity-basics/measuring/index.html">CDC · Cómo medir la intensidad de la actividad física.</a> Referencia general para regular el cardio mediante la conversación.</li>
                <li id="fuente-ensayo"><a href="https://pubmed.ncbi.nlm.nih.gov/37659172/">Ahmad y colaboradores, 2023 · Ejercicio aeróbico, de fuerza y combinado en mujeres con hipotiroidismo.</a> Ensayo aleatorizado con tratamiento farmacológico mantenido.</li>
                <li><a href="https://www.nhs.uk/symptoms/chest-pain/">NHS · Dolor en el pecho y señales que requieren atención urgente.</a> Referencia de seguridad; no permite autodiagnosticarse.</li>
              </ol>
              <p>Contenido educativo de entrenamiento. No diagnostica, interpreta analíticas ni modifica tratamientos. Puedes consultar también nuestra <Link href="/politica-editorial">política editorial</Link>.</p>
            </section>
          </article>
        </Container>
      </section>
    </TopicHubPage>
  )
}
