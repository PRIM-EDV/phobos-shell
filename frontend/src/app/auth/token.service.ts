
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
import { firstValueFrom } from 'rxjs';

const PHOBOS_AUTH_URL = window.__env.phobosAuthUrl ? window.__env.phobosAuthUrl : 'http://localhost:3100';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public accessToken: WritableSignal<string | null> = signal(null);
  public refreshToken: WritableSignal<string | null> = signal(null);

  syncAccessToken = this.localStorageSyncEffect(this.accessToken, 'access.token');
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
    if (response && response.body?.access_token) {
      this.accessToken.set(response.body.access_token);
    } else {
      throw new Error('Failed to retrieve access token');
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
      localStorage.setItem(key, JSON.stringify(signal()));
    });
  }
  
}
