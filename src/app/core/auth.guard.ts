import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@mfe/shared';

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  if (session.isAuthenticated()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
