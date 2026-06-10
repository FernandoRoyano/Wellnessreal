# WellnessReal — Funcionalidades desarrolladas
*Documento para presentación · análisis del código a fecha actual*

---

## 🌐 1. Web pública (captación + marca)

Plataforma completa en **Next.js 16 + React 19 + Tailwind 4**, desplegada en Vercel.

**Páginas de marketing:**
- **Home** — landing principal con animaciones (GSAP), hero, secciones de valor
- **Servicios** — página índice + 4 landings de servicio dedicadas:
  - Entrenamiento online
  - Entrenamiento personalizado
  - Nutrición
  - Osteopatía
- **Tarifas** — planes con selector de precios interactivo
- **Filosofía** — posicionamiento de marca
- **Caso real** — prueba social / testimonios
- **Contacto** — formulario directo

**Conversión:**
- **Valoración gratuita** — formulario multi-paso (objetivo, nivel, disponibilidad, salud, presupuesto)
- **Recurso gratis** — captación de email con guía PDF
- Páginas "gracias" dedicadas (recurso / valoración / general) para tracking de conversiones

**Optimización:**
- SEO técnico completo (metadata, Open Graph, Twitter cards, JSON-LD schema)
- 100+ redirecciones 301 de la web WordPress antigua (preserva posicionamiento Google)
- Cookie banner (RGPD)
- Burbuja de WhatsApp flotante
- Popup de lead magnet + exit-intent popup
- Animaciones avanzadas (parallax, counters, scroll progress, magnetic buttons)

**Mejoras SEO (junio 2026):** tras una auditoría se aplicó una tanda de mejoras de posicionamiento:
- **On-page:** corregido el `<title>` duplicado de la home, eliminado el H1 duplicado en los posts (en render y en el script de importación) y sustituido el texto ancla genérico "Leer artículo" por el título del artículo como enlace descriptivo.
- **Datos estructurados (JSON-LD):** Organization, `HealthAndBeautyBusiness` (LocalBusiness) con coordenadas `geo` y `hasMap`, Person (Fernando Royano), Article y BreadcrumbList en cada post, y **FAQPage** en las páginas de servicio. Campo `sameAs` enlazando Instagram, YouTube, LinkedIn y la **ficha de Google Business Profile** (entidad web ↔ Google para SEO local).
- **Contenido:** las 4 páginas de servicio ampliadas con una sección de método (~500 palabras c/u) y un bloque de **preguntas frecuentes** (6 por servicio, con schema). Nueva sección **"Quién está detrás"** en la home (bio + credenciales) que refuerza el E-E-A-T.
- **Enlazado interno:** sección de **artículos relacionados** al final de cada post (prioriza misma categoría), que reparte autoridad interna y mejora la permanencia.
- **Core Web Vitals:** imágenes del blog migradas de `<img>` a `next/image` (mejor LCP).
- **Perfiles sociales** visibles en el footer (Instagram, YouTube, LinkedIn).
- **Sitemap dinámico** (`sitemap.ts`, 22 URLs desde Supabase) enviado a Google Search Console.

---

## 🎯 2. Funnel de captación (VSL)

Embudo de venta dedicado en ruta `/metodo`:
- Landing de opt-in (nombre + email + teléfono)
- Página de vídeo VSL (Video Sales Letter de ~15 min)
- Integración con email marketing (grupo VSL diferenciado)
- Notificación automática de cada lead cualificado

---

## 📝 3. Blog / CMS completo

Sistema de gestión de contenidos propio (no WordPress):
- **Editor visual enriquecido** (TipTap): negrita, títulos, listas, enlaces, imágenes, **tablas**, citas, código
- **Importador desde Markdown/HTML** — pega contenido y se convierte solo
- Gestión de **categorías**
- Subida de imágenes destacadas a Supabase Storage
- Programación de fecha de publicación
- Estados borrador / publicado
- **CTAs automáticos** insertados dentro de cada artículo (guía al 30%, valoración al 70%)
- Blog público con páginas individuales por artículo, SEO por post
- Importador por línea de comandos para carga masiva de posts

**Contenido actual:** 12+ artículos redactados (entrenamiento, nutrición, mujer, hábitos, recuperación).

---

## 👥 4. Sistema de Leads + Tracking de campañas *(nuevo)*

CRM ligero de captación con atribución de marketing:
- **Tabla central de leads** en Supabase (email, teléfono, origen, estado, notas)
- **Tracking de UTMs** automático: captura `utm_source/medium/campaign/term/content` + `fbclid` de Google/Meta y los persiste 30 días (atribución first-touch)
- **Captura desde todos los formularios** (guía, valoración, VSL, newsletter, footer, popup)
- **Meta Pixel + TikTok Pixel** integrados (listos para activar)
- **Dashboard de leads** en el panel admin:
  - Métricas: total, últimos 7 días, clientes, tasa de conversión, sin contactar
  - Filtros por estado y origen + búsqueda
  - Ficha de detalle con datos del formulario y atribución de campaña
  - Pipeline de estados (nuevo → contactado → qualified → cliente → descartado)
  - Notas internas + botón directo a WhatsApp

---

## 📧 5. Email Marketing

Panel de gestión integrado con MailerLite:
- Dashboard con métricas (suscriptores activos, bajas, rebotes, engagement)
- Gestión de **suscriptores** (listar, ver, eliminar)
- Gestión de **grupos** (segmentos de audiencia)
- Gestión de **campañas** (crear, enviar, ver estadísticas de apertura/clics)
- Envío automático de guía gratuita por email (plantilla HTML branded)
- Captación automática a listas desde todos los formularios

---

## 💼 6. CRM de propuestas y clientes (venta + cobro)

Sistema completo de propuesta comercial → firma → cobro:
- **Creación de propuestas** personalizadas por cliente (servicio, precio, duración, descripción)
- **Página privada por cliente** con enlace único (token): el cliente ve su propuesta a medida
- **Contrato digital** con firma electrónica (nombre completo + timestamp)
- **Cobro integrado con Stripe**:
  - Pago con tarjeta (checkout)
  - Opción de transferencia bancaria
  - Webhook de confirmación automática de pago
- **Seguimiento de estado** visible para el cliente (pendiente → firmado → pagado → confirmado)
- Panel admin para crear/gestionar propuestas y confirmar pagos manualmente

---

## 🎬 7. Módulo de Guiones

Repositorio de guiones de vídeo/contenido en el panel admin:
- Biblioteca de guiones (VSL, reels, anuncios)
- Estados (borrador / listo / grabado)
- Metadatos: duración, nº palabras, propósito
- Vista de detalle con el guión completo formateado

---

## 🔐 8. Panel de administración

Backoffice protegido por contraseña (`/admin`):
- Autenticación por sesión (cookie segura) + middleware de protección de rutas
- **Dashboard** con estadísticas generales
- Módulos: Leads · Propuestas · Guiones · Blog · Email Marketing
- Sidebar de navegación unificada
- Diseño dark branded (morado/amarillo WellnessReal)

---

## ⚙️ 9. Infraestructura e integraciones

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS 4 |
| Base de datos | Supabase (PostgreSQL) |
| Almacenamiento | Supabase Storage (imágenes blog) |
| Pagos | Stripe (checkout + webhooks) |
| Email transaccional | Nodemailer (Gmail SMTP) |
| Email marketing | MailerLite API |
| Email de dominio | ImprovMX (info@wellnessreal.es) |
| Analítica | Google Analytics 4 + eventos custom |
| Publicidad | Meta Pixel + TikTok Pixel (preparados) |
| Editor de texto | TipTap |
| Animaciones | GSAP |
| Validación | Zod + React Hook Form |
| Deploy | Vercel |
| Seguridad | Headers (CSP, X-Frame-Options), middleware auth, RLS Supabase |

---

## 📊 Resumen ejecutivo

WellnessReal no es una web, es una **plataforma de negocio completa**:

1. **Capta** — web SEO + funnel VSL + lead magnets + tracking de campañas
2. **Nutre** — blog con CMS propio + email marketing automatizado
3. **Convierte** — formulario de valoración + propuestas comerciales personalizadas
4. **Cobra** — firma digital de contrato + pago online con Stripe
5. **Mide** — dashboard de leads con atribución + analítica integrada

Todo gestionado desde un único panel de administración propio, sin depender de herramientas externas de pago (WordPress, Calendly, sistemas de propuestas, etc.).
