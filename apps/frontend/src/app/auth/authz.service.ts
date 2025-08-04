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
   * @param role The role to check against the user's token.
   * @returns Promise resolving to true if the user has the role, false otherwise.
   */
  public async hasRole(role: string): Promise<boolean> {
    const token = await this.tokenService.accessToken();
    if (!token) return false;

    try {
      const { role: userRole } = jose.decodeJwt(token) as { role?: string };
      return userRole === role;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}