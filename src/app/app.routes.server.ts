import { RenderMode, ServerRoute } from '@angular/ssr';

// Site entièrement statique : chaque page est prérendue en HTML au build.
// La route joker produit /404, que le script de build renomme en 404.html pour Netlify.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ '**': '404' }],
  },
];
