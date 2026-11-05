import { TestBed } from '@angular/core/testing';
import { CartStore, DEMO_CREDENTIALS, EventBus, SessionService } from '@mfe/shared';

describe('shared state', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('SessionService: login demo e logout', () => {
    const s = TestBed.inject(SessionService);
    expect(s.login(DEMO_CREDENTIALS.email, 'errada')).toBe(false);
    expect(s.isAuthenticated()).toBe(false);
    expect(s.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)).toBe(true);
    expect(s.user()?.email).toBe(DEMO_CREDENTIALS.email);
    s.logout();
    expect(s.user()).toBeNull();
  });

  it('CartStore: soma quantidades, total e emite evento', () => {
    const cart = TestBed.inject(CartStore);
    const events: string[] = [];
    TestBed.inject(EventBus)
      .on('cart:item:added')
      .subscribe((e) => events.push(e.payload.name));
    const item = { productId: 'a', name: 'A', price: 10, emoji: 'x' };
    cart.add(item);
    cart.add(item);
    expect(cart.count()).toBe(2);
    expect(cart.total()).toBe(20);
    expect(events).toEqual(['A', 'A']);
    cart.setQty('a', 0);
    expect(cart.items().length).toBe(0);
  });
});
