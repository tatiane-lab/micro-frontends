import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartStore } from '@mfe/shared';

/** Modo standalone: permite desenvolver/testar o remote isolado (porta 4221). */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="standalone">
      <strong>products-remote</strong> rodando standalone &middot; carrinho: {{ cart.count() }} item(ns)
    </div>
    <div class="body"><router-outlet /></div>
  `,
  styles: `
    .standalone { padding: 8px 16px; font-size: 12px; color: var(--mfe-muted); border-bottom: 1px solid var(--mfe-border); }
    .body { padding: 24px 16px; max-width: 1100px; margin: 0 auto; }
  `,
})
export class App {
  protected readonly cart = inject(CartStore);
}
