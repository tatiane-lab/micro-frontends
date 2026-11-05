import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SessionService } from '@mfe/shared';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the sidebar only when authenticated', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sidebar')).toBeNull();

    TestBed.inject(SessionService).loginAsDemo();
    fixture.detectChanges();
    expect(el.querySelector('.sidebar')).not.toBeNull();
    expect(el.textContent).toContain('Produtos');
  });
});
