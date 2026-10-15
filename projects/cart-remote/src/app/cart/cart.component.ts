import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BrlPipe, CartStore, EventBus, SessionService } from '@mfe/shared';

@Component({
  selector: 'app-cart',
  imports: [BrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  protected readonly cart = inject(CartStore);
  protected readonly session = inject(SessionService);
  private readonly bus = inject(EventBus);

  protected readonly done = signal<{ total: number; items: number } | null>(null);

  protected checkout(): void {
    const summary = { total: this.cart.total(), items: this.cart.count() };
    this.bus.emit('cart:checkout', summary, 'cart-remote');
    this.cart.clear();
    this.done.set(summary);
  }
}
