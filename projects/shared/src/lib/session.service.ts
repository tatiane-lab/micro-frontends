import { Injectable, computed, signal } from '@angular/core';

export interface User {
  readonly email: string;
  readonly name: string;
  readonly role: 'admin' | 'customer';
}

export const DEMO_CREDENTIALS = {
  email: 'demo@portfolio.dev',
  password: 'demo123',
} as const;

const USERS: ReadonlyArray<User & { password: string }> = [
  {
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    name: 'Tatiane (demo)',
    role: 'admin',
  },
];

const STORAGE_KEY = 'mfe:session';

function readStored(): User | null {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/**
 * Sessão compartilhada entre MFEs. Como `@mfe/shared` é um shared mapping singleton
 * da Native Federation, shell e remotes enxergam a MESMA instância (e o mesmo signal).
 * Persistida em localStorage para sobreviver a reload e a remotes rodando standalone.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly _user = signal<User | null>(readStored());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(email: string, password: string): boolean {
    const found = USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!found) return false;
    const { password: _omit, ...user } = found;
    this.set(user);
    return true;
  }

  loginAsDemo(): void {
    this.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  }

  logout(): void {
    this.set(null);
  }

  private set(user: User | null): void {
    this._user.set(user);
    try {
      if (user) globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(user));
      else globalThis.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      /* storage indisponível: sessão vive só em memória */
    }
  }
}
