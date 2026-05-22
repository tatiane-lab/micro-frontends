import { Injectable } from '@angular/core';
import { Subject, Observable, filter, map } from 'rxjs';

export interface BusEvent<T = unknown> {
  type: string;
  payload: T;
  source: string;
}

export type CartAddedEvent = BusEvent<{ productId: string; name: string; price: number }>;
export type UserAuthEvent = BusEvent<{ userId: string; token: string }>;
export type NavigationEvent = BusEvent<{ path: string }>;

@Injectable({ providedIn: 'root' })
export class SharedEventBusService {
  private bus$ = new Subject<BusEvent>();

  emit<T>(event: BusEvent<T>): void {
    this.bus$.next(event);
  }

  on<T>(eventType: string): Observable<BusEvent<T>> {
    return this.bus$.pipe(
      filter((e) => e.type === eventType),
      map((e) => e as BusEvent<T>)
    );
  }

  cartAdded$(productId?: string): Observable<CartAddedEvent> {
    return this.on<CartAddedEvent['payload']>('cart:item:added').pipe(
      filter((e) => !productId || e.payload.productId === productId)
    );
  }

  userAuth$(): Observable<UserAuthEvent> {
    return this.on<UserAuthEvent['payload']>('user:authenticated');
  }
}
