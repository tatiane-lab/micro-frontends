import { Routes } from '@angular/router';

/** Exposto via Native Federation como `./Routes`. */
export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./products/catalog.component').then((m) => m.CatalogComponent),
  },
];
