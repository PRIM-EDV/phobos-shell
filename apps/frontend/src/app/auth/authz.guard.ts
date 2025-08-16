import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { AuthzService } from "./authz.service";

export const authzGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const authzService = inject(AuthzService);
  const roles = route.data['roles'] as string[];

  if (!roles || roles.length === 0) {
    return authService.isAuthenticated();
  } else {
    return authService.isAuthenticated() && roles.some(role => authzService.hasRole(role));
  }
};