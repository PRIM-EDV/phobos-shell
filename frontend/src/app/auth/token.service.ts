
/**
 * TokenService responsible for managing OAuth2 access and refresh tokens within the application.
 * 
 * This service is responsible for:
 * - Store and expose access and refresh tokens using Angular Signals.
 * - Automatically sync token values to Local Storage for persistence across sessions.
 * - Exchange an authorization code (from the OAuth2 PKCE flow) for an access token via HTTP request.
 * 
 * This service assumes a PKCE-compliant OAuth2 authorization server.
 */
import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { ITokenService } from '@phobos/core';
import { firstValueFrom } from 'rxjs';

import * as jose from 'jose'

const PHOBOS_AUTH_URL = window.__env.phobosAuthUrl ? window.__env.phobosAuthUrl : 'http://localhost:3100';

@Injectable({
  providedIn: 'root'
})
export class TokenService implements ITokenService {
  public accessToken = computed(async () => (await this.isTokenValid(this.accessTokenSource()) ? this.accessTokenSource() : null));
  public refreshToken: WritableSignal<string | null> = signal(localStorage.getItem('refresh.token'));

  private accessTokenSource: WritableSignal<string | null> = signal(localStorage.getItem('access.token'));

  syncAccessToken = this.localStorageSyncEffect(this.accessTokenSource, 'access.token');
  syncRefreshToken = this.localStorageSyncEffect(this.refreshToken, 'refresh.token');

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Retrieves the access token from the URL and stores it in the local storage.
   * 
   * @param {string} code - The authorization code received from the OAuth2 server. 
   * @param {string} codeVerifier - The code verifier used to generate the authorization code. 
   */
  public async requestAccessToken(code: string, verifier: string): Promise<void> {
    const clientId = 'webapp';
    const url = `${PHOBOS_AUTH_URL}/auth/token`;
    const body = {
      code: code,
      client_id: clientId,
      code_verifier: verifier
    };

    const response = await firstValueFrom(this.http.post<{access_token: string, token_type: string}>(url, body, { observe: 'response' }))
    if (response && response.status == 200 && response.body?.access_token) {
      this.accessTokenSource.set(response.body.access_token);

    } else {
      throw new Error('Failed to retrieve access token');
    }
  }

  private async fetchCerts(): Promise<any[]> {
    const url = `${PHOBOS_AUTH_URL}/auth/certs`;
    const response = await firstValueFrom(this.http.get<{ keys: any[] }>(url));
    return response.keys;
  }

  /**
   * Validates if the given token is valid by verifying its signature and expiration.
   * 
   * @param {string | null} token - The JWT token to validate
   * @returns {Promise<boolean>} True if the token is valid and not expired
   */
  private async isTokenValid(token: string | null): Promise<boolean> {
    if (!token) {
      console.error('Token is null or undefined');
      return false; 
    }

    try {
      const jwks = await this.fetchCerts();

      const publicKey = await jose.importJWK(jwks[0], "RS256");
      const { payload } = await jose.jwtVerify(token, publicKey);

      // Check if token has expired
      const now = Math.floor(Date.now() / 1000);
      if (!payload.exp || now >= payload.exp) {
        return false
      }

      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return true;
    }
  }

  /**
   * Synchronizes the access and refresh tokens with local storage.
   * 
   * @param {WritableSignal<string | null>} signal - The signal to synchronize with local storage. 
   * @param {string} key - The key to use for local storage.
   */
  private localStorageSyncEffect(signal: WritableSignal<string | null>, key: string) {
    return effect(() => {
      if (signal() === null) {
        localStorage.removeItem(key);
        return;
      } else {
        localStorage.setItem(key, signal() as string);
      }
    });
  }
  
}
