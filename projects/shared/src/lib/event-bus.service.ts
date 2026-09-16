import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';

export interface BusEvent<T = unknown> {
  readonly type: string;
  readonly payload: T;
  readonly source: string;
}

/** Mapa tipado: nome do evento -> payload. */
export interface MfeEvents {
  'cart:item:added': { productId: string; name: string; price: number };
  'cart:checkout': { total: number; items: number };
  'user:authenticated': { email: string };
  'user:logout': Record<string, never>;
}

export type MfeEventType = keyof MfeEvents;

@Injectable({ providedIn: 'root' })
export class EventBus {
  private readonly bus$ = new Subject<BusEvent>();

  emit<K extends MfeEventType>(type: K, payload: MfeEvents[K], source: string): void {
    this.bus$.next({ type, payload, source });
  }

  on<K extends MfeEventType>(type: K): Observable<BusEvent<MfeEvents[K]>> {
    return this.bus$.pipe(
      filter((e) => e.type === type),
      map((e) => e as BusEvent<MfeEvents[K]>),
    );
  }
}
