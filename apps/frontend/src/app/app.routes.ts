import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { authzGuard } from './auth/authz.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  {
    path: 'maptool',
    loadComponent: () => loadRemoteModule('phobos-maptool', './Component').then((m) => m.AppComponent),
    loadChildren: () => loadRemoteModule('phobos-maptool', './Routes').then((m) => m.routes),
  },
  {
    path: 'admin/user',
    canActivate: [authzGuard],
    data: {
      roles: ['admin']
    },
    loadComponent: () => loadRemoteModule('phobos-auth', './Component').then((m) => m.AdminComponent)
  },
  {
    path: 'lsx',
    canActivate: [authzGuard],
    data: {
      roles: ['tec', 'sl', 'admin']
    },
    loadComponent: () => loadRemoteModule('phobos-lsx', './Component').then((m) => m.AppComponent),
    loadChildren: () => loadRemoteModule('phobos-lsx', './Routes').then((m) => m.routes)
  }
];
