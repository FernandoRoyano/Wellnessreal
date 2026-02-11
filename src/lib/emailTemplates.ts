export interface EmailTemplate {
  id: string
  name: string
  description: string
  getHtml: (vars: TemplateVars) => string
}

export interface TemplateVars {
  title: string
  subtitle: string
  body: string
  ctaText: string
  ctaUrl: string
  footerText: string
}

const defaultVars: TemplateVars = {
  title: 'Tu título aquí',
  subtitle: 'Subtítulo o descripción breve',
  body: 'Escribe aquí el contenido principal de tu email. Puedes hablar sobre nuevos servicios, consejos de fitness, ofertas especiales, etc.',
  ctaText: 'Ver más',
  ctaUrl: 'https://wellnessreal.com',
  footerText: 'WellnessReal - Tu bienestar, nuestra pasión',
}

const baseStyles = `
  body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .btn { display: inline-block; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
  img { max-width: 100%; height: auto; }
`

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'modern-dark',
    name: 'Moderno Oscuro',
    description: 'Diseño elegante con fondo oscuro y acentos amarillos (estilo WellnessReal)',
    getHtml: (v) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${baseStyles}</style></head>
<body style="margin:0;padding:0;background-color:#16122B;">
<div style="max-width:600px;margin:0 auto;background-color:#16122B;">
  <!-- Header -->
  <div style="padding:40px 30px 20px;text-align:center;">
    <h1 style="color:#FCEE21;font-size:28px;margin:0;font-weight:800;letter-spacing:1px;">WellnessReal</h1>
  </div>
  <!-- Hero -->
  <div style="padding:20px 30px 30px;text-align:center;">
    <h2 style="color:#ffffff;font-size:26px;margin:0 0 10px;font-weight:700;">${v.title}</h2>
    <p style="color:#958D99;font-size:16px;margin:0;">${v.subtitle}</p>
  </div>
  <!-- Divider -->
  <div style="padding:0 30px;">
    <div style="height:2px;background:linear-gradient(90deg,#662D91,#FCEE21,#662D91);border-radius:2px;"></div>
  </div>
  <!-- Body -->
  <div style="padding:30px;">
    <p style="color:#e0e0e0;font-size:16px;line-height:1.7;margin:0 0 25px;">${v.body}</p>
    <div style="text-align:center;padding:10px 0 20px;">
      <a href="${v.ctaUrl}" class="btn" style="display:inline-block;padding:14px 40px;background-color:#FCEE21;color:#16122B;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">${v.ctaText}</a>
    </div>
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px 30px;text-align:center;border-top:1px solid rgba(102,45,145,0.3);">
    <p style="color:#958D99;font-size:13px;margin:0 0 8px;">${v.footerText}</p>
    <p style="color:#662D91;font-size:12px;margin:0;">Si no deseas recibir más emails, <a href="{$unsubscribe}" style="color:#FCEE21;">date de baja aquí</a></p>
  </div>
</div>
</body></html>`,
  },
  {
    id: 'clean-light',
    name: 'Limpio Claro',
    description: 'Diseño minimalista con fondo blanco, ideal para contenido largo',
    getHtml: (v) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${baseStyles}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
  <!-- Header -->
  <div style="padding:30px;background-color:#16122B;text-align:center;">
    <h1 style="color:#FCEE21;font-size:24px;margin:0;font-weight:800;">WellnessReal</h1>
  </div>
  <!-- Hero -->
  <div style="padding:40px 30px 20px;text-align:center;">
    <h2 style="color:#16122B;font-size:28px;margin:0 0 10px;font-weight:700;">${v.title}</h2>
    <p style="color:#666;font-size:16px;margin:0;">${v.subtitle}</p>
  </div>
  <!-- Body -->
  <div style="padding:20px 30px 30px;">
    <p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 25px;">${v.body}</p>
    <div style="text-align:center;padding:10px 0 20px;">
      <a href="${v.ctaUrl}" class="btn" style="display:inline-block;padding:14px 40px;background-color:#662D91;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">${v.ctaText}</a>
    </div>
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px;background-color:#f8f8f8;text-align:center;border-top:1px solid #eee;">
    <p style="color:#999;font-size:13px;margin:0 0 8px;">${v.footerText}</p>
    <p style="color:#999;font-size:12px;margin:0;">Si no deseas recibir más emails, <a href="{$unsubscribe}" style="color:#662D91;">date de baja aquí</a></p>
  </div>
</div>
</body></html>`,
  },
  {
    id: 'promo-bold',
    name: 'Promocional',
    description: 'Diseño llamativo para ofertas, descuentos y promociones',
    getHtml: (v) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${baseStyles}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
  <!-- Header -->
  <div style="padding:20px 30px;background-color:#16122B;text-align:center;">
    <h1 style="color:#FCEE21;font-size:22px;margin:0;font-weight:800;">WellnessReal</h1>
  </div>
  <!-- Hero Banner -->
  <div style="padding:50px 30px;background:linear-gradient(135deg,#16122B 0%,#662D91 100%);text-align:center;">
    <h2 style="color:#FCEE21;font-size:36px;margin:0 0 10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">${v.title}</h2>
    <p style="color:#ffffff;font-size:18px;margin:0 0 30px;opacity:0.9;">${v.subtitle}</p>
    <a href="${v.ctaUrl}" class="btn" style="display:inline-block;padding:16px 48px;background-color:#FCEE21;color:#16122B;text-decoration:none;border-radius:50px;font-weight:bold;font-size:18px;text-transform:uppercase;letter-spacing:1px;">${v.ctaText}</a>
  </div>
  <!-- Body -->
  <div style="padding:30px;">
    <p style="color:#333;font-size:16px;line-height:1.7;margin:0;text-align:center;">${v.body}</p>
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px;background-color:#16122B;text-align:center;">
    <p style="color:#958D99;font-size:13px;margin:0 0 8px;">${v.footerText}</p>
    <p style="color:#662D91;font-size:12px;margin:0;">Si no deseas recibir más emails, <a href="{$unsubscribe}" style="color:#FCEE21;">date de baja aquí</a></p>
  </div>
</div>
</body></html>`,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Formato newsletter con secciones para compartir contenido y consejos',
    getHtml: (v) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${baseStyles}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
  <!-- Header -->
  <div style="padding:25px 30px;background-color:#16122B;display:flex;align-items:center;justify-content:space-between;">
    <h1 style="color:#FCEE21;font-size:22px;margin:0;font-weight:800;">WellnessReal</h1>
  </div>
  <!-- Title -->
  <div style="padding:30px 30px 15px;border-bottom:3px solid #FCEE21;">
    <h2 style="color:#16122B;font-size:24px;margin:0;font-weight:700;">${v.title}</h2>
    <p style="color:#662D91;font-size:14px;margin:5px 0 0;font-weight:600;">${v.subtitle}</p>
  </div>
  <!-- Main content -->
  <div style="padding:25px 30px;">
    <p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px;">${v.body}</p>
  </div>
  <!-- Divider section -->
  <div style="padding:0 30px;">
    <div style="height:1px;background-color:#eee;"></div>
  </div>
  <!-- CTA section -->
  <div style="padding:25px 30px;text-align:center;">
    <a href="${v.ctaUrl}" class="btn" style="display:inline-block;padding:12px 36px;background-color:#16122B;color:#FCEE21;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">${v.ctaText}</a>
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px;background-color:#f8f8f8;text-align:center;border-top:1px solid #eee;">
    <p style="color:#999;font-size:13px;margin:0 0 8px;">${v.footerText}</p>
    <p style="color:#999;font-size:12px;margin:0;">Si no deseas recibir más emails, <a href="{$unsubscribe}" style="color:#662D91;">date de baja aquí</a></p>
  </div>
</div>
</body></html>`,
  },
]

export function getDefaultVars(): TemplateVars {
  return { ...defaultVars }
}
