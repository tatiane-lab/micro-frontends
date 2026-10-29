import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DEMO_CREDENTIALS, EventBus, SessionService } from '@mfe/shared';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly session = inject(SessionService);
  private readonly bus = inject(EventBus);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly demo = DEMO_CREDENTIALS;
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly error = signal(false);

  protected submit(): void {
    if (this.session.login(this.email(), this.password())) {
      this.afterLogin();
    } else {
      this.error.set(true);
    }
  }

  protected enterAsDemo(): void {
    this.session.loginAsDemo();
    this.afterLogin();
  }

  protected fillDemo(): void {
    this.email.set(this.demo.email);
    this.password.set(this.demo.password);
  }

  private afterLogin(): void {
    const user = this.session.user();
    if (user) this.bus.emit('user:authenticated', { email: user.email }, 'shell');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/home';
    void this.router.navigateByUrl(returnUrl.startsWith('/') ? returnUrl : '/home');
  }
}
