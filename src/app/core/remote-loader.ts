import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export interface RemoteInfo {
  readonly name: string;
  readonly label: string;
  readonly exportName: string;
  readonly color: string;
}

export const REMOTES = {
  products: { name: 'products-remote', label: 'Produtos', exportName: 'PRODUCTS_ROUTES', color: 'var(--mfe-products)' },
  cart: { name: 'cart-remote', label: 'Carrinho', exportName: 'CART_ROUTES', color: 'var(--mfe-cart)' },
} as const satisfies Record<string, RemoteInfo>;

/** Rotas de fallback exibidas quando o remote esta fora do ar. */
function unavailableRoutes(info: RemoteInfo): Routes {
  return [
    {
      path: '',
      data: { remote: info.name, label: info.label },
      loadComponent: () =>
        import('../pages/remote-unavailable.component').then((m) => m.RemoteUnavailableComponent),
    },
  ];
}

/**
 * Carrega o remote sob demanda (lazy). Se falhar (remote offline, versão incompatível),
 * em vez de quebrar a navegação devolve uma rota de fallback com botão "tentar novamente".
 */
export function loadRemoteRoutes(info: RemoteInfo): () => Promise<Routes> {
  return async () => {
    try {
      const mod = (await loadRemoteModule(info.name, './Routes')) as Record<string, Routes>;
      const routes = mod[info.exportName];
      if (!routes) throw new Error(`Export ${info.exportName} não encontrado em ${info.name}`);
      return routes;
    } catch (err) {
      console.error(`[shell] falha ao carregar ${info.name}`, err);
      return unavailableRoutes(info);
    }
  };
}
