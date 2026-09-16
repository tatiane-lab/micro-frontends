import { Injectable, computed, inject, signal } from '@angular/core';
import { EventBus } from './event-bus.service';

export interface CartItem {
  readonly productId: string;
  readonly name: string;
  readonly price: number;
  readonly emoji: string;
  readonly qty: number;
}

export type NewCartItem = Omit<CartItem, 'qty'>;

const STORAGE_KEY = 'mfe:cart';

function readStored(): CartItem[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

/** Estado do carrinho compartilhado (products-remote escreve; cart-remote e shell leem). */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly bus = inject(EventBus);
  private readonly _items = signal<CartItem[]>(readStored());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.qty, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.price * i.qty, 0));

  add(item: NewCartItem, source = 'unknown'): void {
    this.update((items) => {
      const existing = items.find((i) => i.productId === item.productId);
      return existing
        ? items.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { ...item, qty: 1 }];
    });
    this.bus.emit(
      'cart:item:added',
      { productId: item.productId, name: item.name, price: item.price },
      source,
    );
  }

  setQty(productId: string, qty: number): void {
    this.update((items) =>
      qty <= 0
        ? items.filter((i) => i.productId !== productId)
        : items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }

  remove(productId: string): void {
    this.setQty(productId, 0);
  }

  clear(): void {
    this.update(() => []);
  }

  private update(fn: (items: CartItem[]) => CartItem[]): void {
    this._items.update(fn);
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(this._items()));
    } catch {
      /* ignore */
    }
  }
}
