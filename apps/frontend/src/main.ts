import { initFederation } from '@angular-architects/native-federation';

// Bugfix for native-federation
(window as any).ngDevMode = false;

initFederation('federation.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
