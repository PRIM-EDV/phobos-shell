import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
    { path: '', pathMatch: 'full'},
    {
        path: 'maptool',
        loadComponent: () =>
        loadRemoteModule('phobos-maptool', './Component').then((m) => m.AppComponent),
    },
];
