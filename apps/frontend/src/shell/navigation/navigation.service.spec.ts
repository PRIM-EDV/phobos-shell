import { TestBed } from '@angular/core/testing';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { vi } from 'vitest';

import { NavigationService } from './navigation.service';
import { RegistryService } from '../../registry/registry.service';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';


describe('NavigationService', () => {
  let service: NavigationService;
  let registryServiceMock: Partial<RegistryService>;

  const routerEventsSubject = new Subject<any>();

  vi.mock('@angular-architects/native-federation', () => ({
    loadRemoteModule: vi.fn(),
  }));

  beforeEach(() => {
    registryServiceMock = {
      find: vi.fn().mockReturnValue([
        { name: 'auth', baseUrl: new URL('http://phobos.internal/app/auth') },
        { name: 'maptool', baseUrl: new URL('http://phobos.internal/app/maptool') }
      ])
    };

    vi.mocked(loadRemoteModule).mockImplementation((remoteName: string, modulePath: string) => {
      const remotes = new Map<string, any>([
        ['auth', { routes: [{ path: 'admin', data: { view: 'ADMIN', tab: 'USER', roles: ['sl', 'admin'] } }] }],
        ['maptool', { routes: [{ path: 'map', data: { view: 'TACOP', tab: 'MAP', roles: ['sl', 'admin', 'tacop'] } }] }],
      ]);

      return modulePath === './Routes' ? remotes.get(remoteName) : {};
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: RegistryService, useValue: registryServiceMock },
        {provide: Router,  useValue: { events: routerEventsSubject.asObservable() }}
      ]
    });

    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load views correctly from remote', async () => {
    const views = service.views();

    expect(views.length).toBe(2);
    expect(views[0].name).toBe('ADMIN');
    expect(views[0].tabs.length).toBe(1);
    expect(views[0].tabs[0].name).toBe('USER');
    expect(views[0].tabs[0].route).toBe('/app/auth/admin');
    expect(views[0].tabs[0].roles).toEqual(['sl', 'admin']);
  });

  it('should set current view and tab based on URL', async () => {
    routerEventsSubject.next(new NavigationEnd(1, '/', '/app/auth/admin'));
    TestBed.tick();

    const currentView = service.view();
    const currentTab = service.tab();

    expect(currentView?.name).toBe('ADMIN');
    expect(currentTab?.name).toBe('USER');
  });
});
