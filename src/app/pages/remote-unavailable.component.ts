import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-remote-unavailable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="box" role="alert">
      <div class="icon" aria-hidden="true">⚠️</div>
      <h1>{{ label }} indisponível</h1>
      <p>
        O micro-frontend <code>{{ remote }}</code> não respondeu. O restante do shell continua funcionando.
      </p>
      <button type="button" (click)="retry()">Tentar novamente</button>
    </section>
  `,
  styles: `
    .box { max-width: 480px; margin: 48px auto; text-align: center; padding: 32px; border: 1px dashed var(--mfe-danger); border-radius: var(--mfe-radius); background: var(--mfe-surface); }
    .icon { font-size: 44px; }
    h1 { margin: 8px 0; font-size: 22px; }
    p { color: var(--mfe-muted); }
    code { color: var(--mfe-danger); }
    button { background: var(--mfe-shell); color: #0b1020; border: 0; border-radius: 10px; padding: 10px 18px; font-weight: 600; }
  `,
})
export class RemoteUnavailableComponent {
  private readonly data = inject(ActivatedRoute).snapshot.data;
  protected readonly remote = String(this.data['remote'] ?? 'remote');
  protected readonly label = String(this.data['label'] ?? 'Módulo');

  protected retry(): void {
    location.reload();
  }
}
