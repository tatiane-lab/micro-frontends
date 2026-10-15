import { Routes } from '@angular/router';

/** Exposto via Native Federation como `./Routes`. */
export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart/cart.component').then((m) => m.CartComponent),
  },
];
