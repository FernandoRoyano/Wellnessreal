import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/common/Container'
import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'
import styles from './guide.module.css'

export const metadata = buildMetadata({
  title: 'Entrenamiento con Hashimoto: fuerza y ajustes',
  description: 'Guía de entrenamiento para mujeres con Hashimoto: contexto clínico, fuerza, ajustes ante la fatiga y un ejemplo práctico para organizar tus sesiones.',
  path: '/hashimoto/entrenamiento',
  keywords: ['entrenamiento Hashimoto', 'Hashimoto ejercicio', 'Hashimoto entrenamiento fuerza'],
})

const config: TopicHubConfig = {
  eyebrow: 'Hashimoto y entrenamiento de fuerza',
  title: 'Entrenar con Hashimoto:',
  highlightedTitle: 'fuerza que puedas sostener',
  introduction: 'Una guía para mujeres con Hashimoto que quieren empezar o retomar la fuerza. Entiende qué depende de tu situación clínica y cómo organizar el ejercicio según tu experiencia y recuperación.',
  answer: 'Hashimoto no determina por sí solo cuánto puedes entrenar. Si tu situación clínica permite hacer ejercicio, parte de lo que puedes realizar con control y recuperar. Registra tu respuesta y ajusta el plan; no utilices las sensaciones del entrenamiento para diagnosticarte o cambiar el tratamiento.',
  path: '/hashimoto/entrenamiento',
  sections: [
    { title: 'Sitúa el diagnóstico', body: 'Hashimoto y función tiroidea no describen exactamente lo mismo. El seguimiento sanitario ayuda a entender tu situación actual.' },
    { title: 'Parte de tu nivel', body: 'Tu experiencia, horarios y capacidad de recuperación sirven para elegir movimientos y una dificultad razonable.' },
    { title: 'Observa antes de añadir', body: 'Conserva un registro sencillo. Repetir, reducir o progresar son decisiones que se toman con contexto, no por obligación.' },
  ],
  guides: [
    { href: '/hipotiroidismo/ejercicio', title: 'Ejercicios y semana de inicio', description: 'Los cuatro patrones ilustrados, variantes de casa y gimnasio y un ejemplo de distribución semanal.' },
    { href: '/blog/agujetas-cansancio-debilidad-tiroides', title: 'Agujetas, cansancio y debilidad', description: 'Diferencias que conviene observar y situaciones en las que hay que consultar.' },
    { href: '/blog/rir-rpe-autoregular-entrenamiento', title: 'Cómo regular el esfuerzo', description: 'Qué significan RIR y RPE y cómo usarlos al describir una sesión.' },
    { href: '/blog/ganar-masa-muscular-con-hipotiroidismo', title: 'Ganar masa muscular con hipotiroidismo', description: 'Fuerza, progresión y recuperación, distinguiendo la evidencia general de los ejemplos prácticos.' },
  ],
  faqs: [
    { question: '¿Hashimoto e hipotiroidismo son lo mismo?', answer: 'Hashimoto es una enfermedad autoinmune que puede causar hipotiroidismo, que describe una función tiroidea insuficiente. Puede haber etapas con función conservada. Por eso la planificación necesita conocer tu situación clínica actual, además del nombre del diagnóstico.' },
    { question: '¿Puedo levantar pesas si tengo Hashimoto?', answer: 'El diagnóstico por sí solo no permite decidir tu carga ni tus restricciones. Si tu situación clínica permite hacer fuerza, el plan se adapta a tu experiencia, técnica y recuperación. Ante síntomas nuevos o cambios importantes, consulta antes de intensificar.' },
    { question: '¿Tengo que entrenar siempre muy suave?', answer: 'No se elige la intensidad únicamente por tener Hashimoto. El punto de partida, la situación clínica y la respuesta al entrenamiento ayudan a decidir cuánto esfuerzo y volumen puedes manejar. Esta guía no establece una intensidad universal.' },
    { question: '¿Necesito hacer HIIT para progresar?', answer: 'No es necesario incluir intervalos de alta intensidad para utilizar esta guía. Puedes organizar fuerza y actividad aeróbica tolerable. Si quieres incorporar trabajo intenso, valora primero tu situación clínica, experiencia y recuperación.' },
    { question: '¿Qué hago si después de entrenar me encuentro peor durante días?', answer: 'Evita aumentar la carga para intentar acostumbrarte. Detén la progresión y consulta para valorar ese empeoramiento, sobre todo si es intenso, nuevo o repetido. Un registro de actividad y síntomas puede aportar contexto, pero no identifica la causa.' },
    { question: '¿El entrenamiento sustituye el tratamiento o permite cambiar la medicación?', answer: 'No debes modificar ni suspender el tratamiento por notar cambios al entrenar. Las decisiones sobre medicación, analíticas y seguimiento de Hashimoto corresponden a tu equipo sanitario. El objetivo de esta guía es ayudarte a organizar el ejercicio.' },
  ],
  cta: { title: '¿Quieres convertirlo en un plan acompañado?', description: 'Método BASE Tiroides ofrece doce semanas de fuerza adaptada, hábitos y seguimiento con Fernando. Revisa el alcance y solicita plaza si encaja contigo.', href: '/metodo-tiroides', label: 'Conocer Método BASE Tiroides' },
}

const scenarios = [
  { title: 'La sesión encaja y recuperas como de costumbre', decision: 'Repite el plan. Si varias sesiones son manejables, puedes probar una repetición más en un ejercicio y observar la respuesta.', record: 'Variante, carga, repeticiones y margen que sentías al terminar.' },
  { title: 'Has dormido poco y hoy tienes menos energía', decision: 'Puedes mantener los movimientos y reducir el trabajo: por ejemplo, una serie en lugar de dos. También puedes descansar según cómo te encuentres.', record: 'Qué cambiaste, el contexto de sueño y cómo recuperaste después.' },
  { title: 'Aparece un empeoramiento intenso o repetido', decision: 'Detén la progresión y consulta antes de insistir. No lo atribuyas automáticamente a una falta de forma o a Hashimoto.', record: 'Cuándo empezó, qué actividad hiciste y cómo afecta a tus tareas habituales.' },
]

export default function HashimotoTrainingPage() {
  return (
    <TopicHubPage config={config}>
      <section className="bg-brand-deep py-fluid-xl" aria-label="Guía práctica de fuerza con Hashimoto">
        <Container>
          <article className={styles.guide}>
            <header className={styles.byline}>
              <p>Por <Link href="/sobre-mi#enfoque-tiroides" rel="author">Fernando Royano</Link> · Graduado en Ciencias de la Actividad Física y del Deporte.</p>
              <p>Publicada el <time dateTime="2026-11-04">4 de noviembre de 2026</time>. Contenido educativo de entrenamiento.</p>
            </header>

            <nav className={styles.contents} aria-label="Índice de la guía de Hashimoto">
              <p>Encuentra tu punto de partida</p>
              <ol>
                <li><a href="#hashimoto-y-funcion">Diagnóstico y función tiroidea</a></li>
                <li><a href="#organizar-fuerza">Cómo organizar la fuerza</a></li>
                <li><a href="#ejemplo-ajustes">Un ejemplo de ajustes</a></li>
                <li><a href="#registro-recuperacion">Qué registrar y cómo decidir</a></li>
                <li><a href="#cuando-consultar">Cuándo parar y consultar</a></li>
                <li><a href="#fuentes-hashimoto">Fuentes y límites</a></li>
              </ol>
            </nav>

            <section id="hashimoto-y-funcion" className={styles.chapter}>
              <span className="eyebrow">Entender el contexto</span>
              <h2>Tener Hashimoto no describe toda tu situación</h2>
              <p>Hashimoto es una enfermedad autoinmune que puede dañar la tiroides y provocar hipotiroidismo. Puede existir una etapa con función tiroidea conservada. El <a href="#fuente-niddk-hashimoto">NIDDK</a> y la <a href="#fuente-ata-hashimoto">American Thyroid Association</a> explican esta evolución y su seguimiento.</p>
              <p>Para entrenar, esto importa porque dos mujeres con el mismo diagnóstico pueden partir de situaciones distintas. Una puede llevar años haciendo fuerza y otra estar retomando la actividad con síntomas todavía en valoración. No necesitan recibir automáticamente el mismo plan.</p>
              <p>Antes de añadir dificultad, sitúa tres cosas: las indicaciones de tu equipo sanitario, tu experiencia reciente de entrenamiento y cómo estás recuperando. Si tienes un diagnóstico reciente, síntomas importantes o cambios de tratamiento, acuerda con tu equipo qué actividad es adecuada antes de intensificar.</p>
              <p>Un mal entrenamiento tampoco permite saber cómo está tu función tiroidea. Conviene mirar el contexto sin convertir cada cambio de energía en una conclusión médica.</p>
            </section>

            <section id="organizar-fuerza" className={styles.chapter}>
              <span className="eyebrow">Construir una referencia</span>
              <h2>Empieza por una estructura que puedas observar</h2>
              <p>Si puedes hacer ejercicio, una forma práctica de organizarlo es elegir pocos movimientos conocidos, distribuirlos en los días disponibles y repetirlos el tiempo suficiente para aprender cómo respondes. No necesitas cambiar de rutina cada semana.</p>
              <div className={styles.exerciseExample}>
                <figure>
                  <Image src="/guides/ejercicio-hipotiroidismo/sentarte-levantarte-compact-v1.webp" alt="Dos variantes de sentarte y levantarte: con apoyo en una silla y sentadilla a un banco, con cuádriceps y glúteos destacados." width={768} height={512} sizes="320px" className={styles.exerciseImage} />
                  <figcaption>Silla en casa y sentadilla a banco en gimnasio. Ilustración generada con IA; el rojo destaca zonas implicadas, sin medir su activación.</figcaption>
                </figure>
                <div>
                  <p>Sentarte y levantarte, mover la cadera, empujar y tirar hacia ti permiten organizar una sesión de cuerpo completo. Elige variantes que controles, con material estable y una dificultad que puedas ajustar.</p>
                  <p>En la <Link href="/hipotiroidismo/ejercicio#casa-o-gimnasio">guía general de ejercicio tienes los cuatro patrones ilustrados</Link>, sus alternativas para casa y gimnasio y un ejemplo de semana. Aquí nos centraremos en decidir cuándo mantener o cambiar ese trabajo.</p>
                </div>
              </div>
              <p>Dejar algunas repeticiones posibles al terminar una serie puede ayudarte a describir el esfuerzo. Si el concepto es nuevo, lee primero <Link href="/blog/rir-rpe-autoregular-entrenamiento">cómo se utilizan las repeticiones en reserva</Link>. El objetivo es tener una referencia, no acertar una cifra perfecta.</p>
              <p>El cardio puede organizarse con la misma lógica: una actividad tolerable, una duración ajustable y un registro de la respuesta. No hace falta añadir sesiones para compensar un día en el que no pudiste entrenar.</p>
            </section>

            <section id="ejemplo-ajustes" className={styles.chapter}>
              <span className="eyebrow">Ejemplo orientativo</span>
              <h2>El mismo plan, tres decisiones diferentes</h2>
              <p>Imagina un plan ya adaptado a ti, con dos sesiones semanales y dos series de cada movimiento. Estas cantidades sirven para explicar los ajustes; no son una pauta indicada para todas las mujeres con Hashimoto.</p>
              <ol className={styles.scenarios}>
                {scenarios.map((scenario) => (
                  <li key={scenario.title}>
                    <h3>{scenario.title}</h3>
                    <p><strong>Decisión:</strong> {scenario.decision}</p>
                    <p><strong>Qué anotar:</strong> {scenario.record}</p>
                  </li>
                ))}
              </ol>
              <p>La progresión se construye observando varias sesiones. Si antes hacías ocho repeticiones con control y ahora haces nueve con un esfuerzo parecido, tienes un dato útil. Mantener las ocho en una semana difícil también puede ser una decisión razonable.</p>
            </section>

            <section id="registro-recuperacion" className={styles.chapter}>
              <span className="eyebrow">Pocos datos, útiles</span>
              <h2>Qué registrar sin convertirlo en otro trabajo</h2>
              <ul className={styles.list}>
                <li><strong>Lo realizado:</strong> ejercicio o variante, series, repeticiones y carga cuando corresponda.</li>
                <li><strong>El esfuerzo:</strong> cuánto margen sentías y si podías conservar la técnica.</li>
                <li><strong>La recuperación:</strong> cómo te encontraste después y si pudiste realizar tus tareas habituales.</li>
                <li><strong>El contexto:</strong> sueño, cambios relevantes de rutina y molestias que convenga comentar.</li>
              </ul>
              <p>Con esos datos puedes explicar mejor qué ocurrió y acordar un ajuste. Si necesitas reducir siempre para poder completar la semana, merece la pena revisar el conjunto del plan y el contexto clínico.</p>
              <p>Las analíticas y los anticuerpos pertenecen al seguimiento sanitario. No son una puntuación de tu esfuerzo ni el criterio con el que esta guía evalúa una sesión.</p>
            </section>

            <section id="cuando-consultar" className={styles.chapter}>
              <span className="eyebrow">Dar prioridad a lo que ocurre</span>
              <h2>Cuándo dejar de ajustar por tu cuenta</h2>
              <p>Si aparece debilidad progresiva, palpitaciones, dolor que preocupa o un cansancio intenso, nuevo o persistente, detén la sesión y consulta antes de insistir. Si el esfuerzo te deja mucho peor durante días, evita aumentar la carga para intentar acostumbrarte.</p>
              <p>Ante dolor en el pecho, desmayo o dificultad importante para respirar, busca atención urgente. La <a href="#fuente-seguridad">referencia del NHS sobre dolor torácico</a> explica señales que requieren atención inmediata.</p>
              <p>Puedes ampliar la diferencia entre molestias habituales y situaciones que necesitan valoración en <Link href="/blog/agujetas-cansancio-debilidad-tiroides">agujetas, cansancio y debilidad</Link>. El registro ayuda a describir lo que pasa, pero no diagnostica su causa.</p>
            </section>

            <section id="fuentes-hashimoto" className={styles.chapter}>
              <span className="eyebrow">Evidencia y aplicación</span>
              <h2>Qué respaldan las fuentes y qué aporta esta guía</h2>
              <p>Una <a href="#fuente-ejercicio">revisión de 2025 reúne siete ensayos de ejercicio en adultos con hipotiroidismo</a>. Encontró cambios en parámetros tiroideos, con distinta certeza según el resultado estudiado. No valida esta guía ni establece una rutina única para todas las mujeres con Hashimoto.</p>
              <p>Los ejemplos de organización y ajustes son una aplicación educativa de criterios de entrenamiento. Su propósito es ayudarte a observar y explicar tu respuesta al ejercicio. No ofrecen una cura, una reducción garantizada de anticuerpos ni una modificación del tratamiento.</p>
              <ol className={styles.list}>
                <li id="fuente-niddk-hashimoto"><a href="https://www.niddk.nih.gov/health-information/endocrine-diseases/hashimotos-disease">NIDDK · Enfermedad de Hashimoto.</a> Contexto de la enfermedad, síntomas y seguimiento.</li>
                <li id="fuente-ata-hashimoto"><a href="https://www.thyroid.org/hashimotos-thyroiditis/">American Thyroid Association · Tiroiditis de Hashimoto.</a> Distinción entre autoinmunidad y función tiroidea.</li>
                <li id="fuente-ejercicio"><a href="https://pubmed.ncbi.nlm.nih.gov/40446861/">Sundus y colaboradores, 2025 · Revisión de intervenciones de ejercicio en hipotiroidismo.</a> Evidencia en adultos con hipotiroidismo, no validación de un protocolo universal para Hashimoto.</li>
                <li id="fuente-seguridad"><a href="https://www.nhs.uk/symptoms/chest-pain/">NHS · Dolor en el pecho.</a> Referencia sobre señales que requieren atención urgente.</li>
              </ol>
              <p>Puedes conocer la <Link href="/sobre-mi#enfoque-tiroides">formación y el enfoque de Fernando</Link> y consultar la <Link href="/politica-editorial">política editorial</Link>.</p>
              <p>Para continuar aprendiendo paso a paso, puedes <Link href="/comunidad/entrar">entrar en la comunidad gratuita con tu email</Link>. Las lecciones y conversaciones están reservadas a los miembros.</p>
            </section>
          </article>
        </Container>
      </section>
    </TopicHubPage>
  )
}
