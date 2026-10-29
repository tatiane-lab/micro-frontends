import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartStore, EventBus, SessionService } from '@mfe/shared';
import { merge, map } from 'rxjs';

interface Toast {
  readonly id: number;
  readonly text: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Micro-frontends');
  protected readonly session = inject(SessionService);
  protected readonly cart = inject(CartStore);
  private readonly router = inject(Router);
  private readonly bus = inject(EventBus);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly menuOpen = signal(false);
  protected readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  protected readonly links = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Produtos', icon: '🛍️' },
    { path: '/cart', label: 'Carrinho', icon: '🛒' },
  ] as const;

  constructor() {
    // Remotes comunicam com o shell (e entre si) via EventBus compartilhado.
    merge(
      this.bus.on('cart:item:added').pipe(map((e) => `${e.payload.name} adicionado ao carrinho (${e.source})`)),
      this.bus.on('cart:checkout').pipe(map((e) => `Pedido finalizado: ${e.payload.items} item(ns)`)),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((text) => this.toast(text));
  }

  protected logout(): void {
    this.session.logout();
    this.bus.emit('user:logout', {}, 'shell');
    this.menuOpen.set(false);
    void this.router.navigateByUrl('/login');
  }

  private toast(text: string): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, text }]);
    setTimeout(() => this.toasts.update((t) => t.filter((x) => x.id !== id)), 3000);
  }
}
