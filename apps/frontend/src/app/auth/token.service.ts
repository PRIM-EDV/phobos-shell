
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
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { ITokenService } from '@phobos/core';
import { firstValueFrom } from 'rxjs';

import * as jose from 'jose'

const PHOBOS_AUTH_URL = window.__env?.phobosAuthUrl ? window.__env.phobosAuthUrl : 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class TokenService implements ITokenService {
  public accessToken: WritableSignal<string | null> = signal(localStorage.getItem('access.token'));
  public refreshToken: WritableSignal<string | null> = signal(localStorage.getItem('refresh.token'));

  syncAccessToken = this.localStorageSyncEffect(this.accessToken, 'access.token');
  syncRefreshToken = this.localStorageSyncEffect(this.refreshToken, 'refresh.token');
  validateAccessToken = this.validateAccessTokenEffect(this.accessToken);

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Retrieves the access token from the URL and stores it in the local storage.
   * 
   * @param {string} code - The authorization code received from the OAuth2 server. 
   * @param {string} verifier - The code verifier used to generate the authorization code. 
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
      this.accessToken.set(response.body.access_token);

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

  /**
   * Validates if the given token is valid by verifying its signature and expiration.
   * 
   * @param {WritableSignal<string | null>} token - The JWT token signal to validate
   */
  private validateAccessTokenEffect(token: WritableSignal<string | null>) {
    return effect(async () => {
     if (!token()) {
        console.error('Token is null or undefined');
        token.set(null);
        return;
      }

      try {
        const jwks = await this.fetchCerts();

        if (jwks.length === 0) {
          console.error('No JWKS found');
          token.set(null);
          return;
        }

        const publicKey = await jose.importJWK(jwks[0], "RS256");
        const { payload } = await jose.jwtVerify(token() as string, publicKey);

        // Check if token has expired
        const now = Math.floor(Date.now() / 1000);
        if (!payload.exp || now >= payload.exp) {
          token.set(null);
          return;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        token.set(null);
      }
    });
  }
}
