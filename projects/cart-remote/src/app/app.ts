import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Modo standalone: permite desenvolver/testar o remote isolado (porta 4222). */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="standalone"><strong>cart-remote</strong> rodando standalone</div>
    <div class="body"><router-outlet /></div>
  `,
  styles: `
    .standalone { padding: 8px 16px; font-size: 12px; color: var(--mfe-muted); border-bottom: 1px solid var(--mfe-border); }
    .body { padding: 24px 16px; max-width: 900px; margin: 0 auto; }
  `,
})
export class App {}
