# WellnessReal

Plataforma full-stack para la gestión de un negocio de entrenamiento personal online. En producción en [wellnessreal.es](https://wellnessreal.es).

Combina una **web pública** orientada a captación con un **panel de administración privado** que cubre el ciclo completo del negocio: lead → propuesta → contrato firmado digitalmente → pago → seguimiento.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19 + Tailwind CSS v4 + tokens en `@theme` |
| Lenguaje | TypeScript 5 |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Cookie de sesión `httpOnly` (servidor) |
| Editor de blog | Tiptap 3 + extensión Table |
| Email marketing | MailerLite API v3 |
| Email transaccional | Nodemailer + Gmail SMTP |
| Pagos | Stripe Checkout + webhooks |
| Despliegue | Vercel (CI/CD desde GitHub) |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── (public)/        Web pública (SSG / SSR según ruta)
│   ├── (funnel)/metodo/ Funnel VSL con opt-in por email
│   ├── admin/           Panel de administración (protegido por middleware)
│   ├── api/             API Routes (REST)
│   └── cliente/[token]/ Vista pública de propuesta + firma digital
├── components/          Componentes React reutilizables
├── lib/                 Lógica de negocio, tipos, acceso a datos
└── middleware.ts        Auth global de /admin/*
content/blog/            Source markdown de los posts del blog
public/                  Assets estáticos (imágenes, PDFs, fuentes)
scripts/                 Utilidades de mantenimiento (importadores, generadores)
```

---

## Arrancar en local

Requisitos: Node 20+, npm, una cuenta de Supabase.

```bash
git clone https://github.com/FernandoRoyano/Wellnessreal.git
cd Wellnessreal
npm install
cp .env.example .env.local   # rellenar con tus credenciales
npm run dev                  # http://localhost:3000
```

Variables de entorno mínimas (ver `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
GMAIL_USER=
GMAIL_APP_PASSWORD=
MAILERLITE_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Módulos principales

- **Web pública** (`(public)`): home, servicios, tarifas, blog, valoración, recurso gratuito, caso real, páginas legales.
- **Funnel VSL** (`(funnel)/metodo`): landing con opt-in y vídeo de venta + CTA único hacia valoración.
- **Panel admin** (`admin/`): dashboard, propuestas comerciales, blog (editor Tiptap con tablas), email marketing (MailerLite) y guiones internos.
- **Cliente** (`cliente/[token]`): vista pública de la propuesta enviada, firma digital con registro de IP + timestamp, integración con Stripe.

Ver `src/app/api/` para todos los endpoints REST disponibles.

---

## Scripts útiles

### Importar un post de blog desde Markdown

Lee un `.md` con frontmatter, convierte el cuerpo a HTML (incluyendo tablas Markdown) y crea la entrada en Supabase como borrador.

```bash
node scripts/import-blog-post.mjs content/blog/mi-post.md
node scripts/import-blog-post.mjs content/blog/mi-post.md --publish
```

Frontmatter soportado: `título`, `slug`, `categoría`, `fecha`, `tiempo_lectura`, `meta_descripción`, `imagen_destacada`, `imagen_alt`, `autor`. Si la categoría no existe se crea automáticamente.

### Generar una imagen de cabecera tipográfica

Genera un PNG/JPG de 1200×630 con fondo branded y texto. Para emergencias o cabeceras sin foto.

```bash
node scripts/generate-blog-header.mjs \
  --out public/blog/mi-post.jpg \
  --eyebrow "CATEGORÍA" \
  --title "PRIMERA LÍNEA|SEGUNDA LÍNEA" \
  --highlight "REMATE EN VERDE." \
  --subtitle "Subtítulo línea 1.|Subtítulo línea 2." \
  --url "wellnessreal.es"
```

---

## Despliegue

CI/CD automático en Vercel desde la rama `main`. Cada push dispara un build; si pasa, se promueve a producción en [wellnessreal.es](https://wellnessreal.es).

Las variables de entorno viven en el panel de Vercel y se inyectan en build/runtime. La base de datos Supabase tiene backups automáticos diarios con retención de 7 días.

---

## Licencia

Privado. © Fernando Royano Cabrero.
