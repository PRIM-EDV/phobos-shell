import { Injectable } from "@angular/core";

import { TokenService } from "./token.service";

import * as jose from 'jose'

@Injectable({
  providedIn: 'root'
})
export class AuthzService {
  constructor(
    private readonly tokenService: TokenService
  ) { }

  /**
   * Checks if the current user has the specified role.
   * @param roles The roles to check against the user's token.
   * @returns True if the user has any of the specified roles, false otherwise.
   */
  public hasRole(roles: string[]): boolean {
    const token = this.tokenService.accessToken();
    if (!token) return false;

    try {
      const { scope: userRole } = jose.decodeJwt(token) as { scope?: string };
      return roles.includes(userRole || '');
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}