import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { BrlPipe, CartStore, SessionService } from '@mfe/shared';

type Status = 'checking' | 'online' | 'offline';

interface RemoteStatus {
  readonly name: string;
  readonly url: string;
  readonly route: string;
  readonly status: Status;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, BrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  protected readonly session = inject(SessionService);
  protected readonly cart = inject(CartStore);
  protected readonly remotes = signal<RemoteStatus[]>([]);

  async ngOnInit(): Promise<void> {
    let manifest: Record<string, string> = {};
    try {
      manifest = (await (await fetch('federation.manifest.json')).json()) as Record<string, string>;
    } catch {
      /* sem manifest: lista vazia */
    }
    const routes: Record<string, string> = { 'products-remote': '/products', 'cart-remote': '/cart' };
    this.remotes.set(
      Object.entries(manifest).map(([name, url]) => ({ name, url, route: routes[name] ?? '/', status: 'checking' })),
    );
    for (const r of this.remotes()) void this.ping(r);
  }

  protected async ping(r: RemoteStatus): Promise<void> {
    this.setStatus(r.name, 'checking');
    try {
      const res = await fetch(r.url, { signal: AbortSignal.timeout(3000) });
      this.setStatus(r.name, res.ok ? 'online' : 'offline');
    } catch {
      this.setStatus(r.name, 'offline');
    }
  }

  private setStatus(name: string, status: Status): void {
    this.remotes.update((list) => list.map((r) => (r.name === name ? { ...r, status } : r)));
  }
}
