import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

import { authzGuard } from './auth/authz.guard';

const staticRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
];

export async function appRoutes(): Promise<Routes> {
  try {
    const dynamicRoutes: Routes = await generateManifestRoutes();
    console.log('Loaded dynamic routes:', dynamicRoutes);
    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Error loading federation manifest:', error);
  }

  return staticRoutes;
}

async function generateManifestRoutes(): Promise<Routes> {
  try {
    const federationManifestResponse = await fetch('federation.manifest.json');
    const phobosManifestResponse = await fetch('phobos.manifest.json');

    const federationManifest: Record<string, string> = await federationManifestResponse.json();
    const phobosManifest: Record<string, string> = await phobosManifestResponse.json();

    const remotes = Object.keys(federationManifest).map(name => ({
      name,
      remoteUrl: federationManifest[name],
      remotePath: phobosManifest[name]
    }));

    const remoteConfigs = await Promise.all(remotes.map(async (remote) => {
      try {
        const routeModule = await loadRemoteModule(remote.name, './Routes');
        const routePath = remote.remotePath;
        const routeRoles = getRouteRoles(routeModule.routes);

        return { ...remote, routePath, routeRoles };
      } catch (error) {
        console.error(`Skipping routes for remote [${remote.name}]:`, error);
        return { ...remote, routePath: null, routeRoles: null };
      }
    }));

    const routes = remoteConfigs
      .filter(config => config.routePath != null && config.routeRoles != null)
      .map(({ name, routePath, routeRoles }) => {
      return {
        path: routePath,
        canActivate: [authzGuard],
        data: {
          roles: routeRoles
        },
        loadComponent: () => loadRemoteModule(name, './Component').then((m) => m.AppComponent),
        loadChildren: () => loadRemoteModule(name, './Routes').then((m) => m.routes)
      }
    });

    return routes;
  } catch (error) {
    console.error('Error loading manifest routes:', error);
    return [];
  }
}

function getRouteRoles(routes: Routes): string[] {
  const routeRoles = routes
    .filter((route) => route.data?.["app"] != null)
    .map((route) => (route.data?.["roles"] as string[]) || []);

  // Empty role set means parent route has to be unprotected
  const hasEmptyRoleSet = routeRoles.some((roles) => roles.length === 0);
  if (hasEmptyRoleSet) { 
    return []; 
  } 

  return [...new Set(routeRoles.flat())];
}