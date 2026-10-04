import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/enseignants/detail/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'pedagogie/detail/:code',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
