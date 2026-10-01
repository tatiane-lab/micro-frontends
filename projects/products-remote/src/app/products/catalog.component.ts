import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BrlPipe, CartStore } from '@mfe/shared';
import { PRODUCTS, Product } from './products.data';

type Sort = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

@Component({
  selector: 'app-catalog',
  imports: [BrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private readonly cart = inject(CartStore);

  protected readonly categories = ['Todos', ...new Set(PRODUCTS.map((p) => p.category))];
  protected readonly query = signal('');
  protected readonly category = signal('Todos');
  protected readonly sort = signal<Sort>('relevance');

  protected readonly visible = computed<Product[]>(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();
    const list = PRODUCTS.filter(
      (p) => (cat === 'Todos' || p.category === cat) && (!q || p.name.toLowerCase().includes(q)),
    );
    switch (this.sort()) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  });

  protected qtyInCart(id: string): number {
    return this.cart.items().find((i) => i.productId === id)?.qty ?? 0;
  }

  protected add(p: Product): void {
    this.cart.add({ productId: p.id, name: p.name, price: p.price, emoji: p.emoji }, 'products-remote');
  }

  protected onQuery(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
  }

  protected onSort(e: Event): void {
    this.sort.set((e.target as HTMLSelectElement).value as Sort);
  }
}
