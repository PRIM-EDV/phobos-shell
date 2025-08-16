import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo:'' },
    {
        path: 'maptool',
        loadComponent: () => loadRemoteModule('phobos-maptool', './Component').then((m) => m.AppComponent),
        loadChildren: () => loadRemoteModule('phobos-maptool', './Routes').then((m) => m.routes), 
    },
    { path: 'admin/user',
        loadComponent: () => loadRemoteModule('phobos-auth', './Component').then((m) => m.UserComponent)
    },
    { path: 'lsx',
        loadComponent: () => loadRemoteModule('phobos-lsx', './Component').then((m) => m.AppComponent),
        loadChildren: () => loadRemoteModule('phobos-lsx', './Routes').then((m) => m.routes)
    }
];
