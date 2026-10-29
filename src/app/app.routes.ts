import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { REMOTES, loadRemoteRoutes } from './core/remote-loader';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Entrar',
    loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    title: 'Home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    title: 'Produtos',
    canActivate: [authGuard],
    loadChildren: loadRemoteRoutes(REMOTES.products),
  },
  {
    path: 'cart',
    title: 'Carrinho',
    canActivate: [authGuard],
    loadChildren: loadRemoteRoutes(REMOTES.cart),
  },
  { path: '**', redirectTo: 'home' },
];
