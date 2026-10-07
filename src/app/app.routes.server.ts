import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'notifications',
    renderMode: RenderMode.Client
  },
  {
    path: 'communication',
    renderMode: RenderMode.Client
  },
  {
    path: 'messagerie',
    renderMode: RenderMode.Client
  },
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
