const osteofitArticle = {
  slug: 'caminar-salud-osea-osteofit',
  name: 'Método Osteofit',
  author: 'Javier Giménez',
  articleUrl: 'https://metodoosteofit.com/caminar-y-osteoporosis/',
  programUrl: 'https://metodoosteofit.com/el-metodo/',
} as const

/** Colaboraciones de lectura: accesibles por enlace, excluidas de la indexación. */
export function getBlogPartner(slug: string) {
  return slug === osteofitArticle.slug ? osteofitArticle : undefined
}
