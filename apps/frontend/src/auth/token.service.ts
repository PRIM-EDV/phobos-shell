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
import { HttpClient } from "@angular/common/http";
import { effect, Injectable, signal, WritableSignal } from "@angular/core";
import { ITokenService } from "@phobos/core";

import { firstValueFrom } from "rxjs";
import { RegistryService } from "../registry/registry.service";

const DEFAULT_AUTH_URL = `${window.location.protocol}//${window.location.hostname}/app/auth`;

@Injectable({
  providedIn: "root",
})
export class TokenService implements ITokenService {
  public accessToken: WritableSignal<string | null> = signal(localStorage.getItem("access.token"));
  public refreshToken: WritableSignal<string | null> = signal(localStorage.getItem("refresh.token"));

  syncAccessToken = this.localStorageSyncEffect(this.accessToken, "access.token");
  syncRefreshToken = this.localStorageSyncEffect(this.refreshToken, "refresh.token");
  validateAccessToken = this.validateAccessTokenEffect(this.accessToken);

  private authApiUrl: string;

  constructor(
    private registry: RegistryService,
    private http: HttpClient,
  ) {
    const authProvider = this.registry.find({ name: "phobos-auth" });

    if (authProvider.length === 0) {
      console.warn("Auth provider not found in registry, using default URL");
      this.authApiUrl = DEFAULT_AUTH_URL;
    } else {
      this.authApiUrl = authProvider[0].apiUrl.toString();
    }
  }

  /**
   * Retrieves the access token from the URL and stores it in the local storage.
   *
   * @param {string} code - The authorization code received from the OAuth2 server.
   * @param {string} verifier - The code verifier used to generate the authorization code.
   */
  public async requestAccessToken(code: string, verifier: string): Promise<void> {
    const clientId = "webapp";
    const url = `${this.authApiUrl}/v1/token`;
    const body = {
      code: code,
      client_id: clientId,
      code_verifier: verifier,
    };

    const response = await firstValueFrom(this.http.post<{ access_token: string; token_type: string }>(url, body, { observe: "response" }));
    if (response && response.status == 200 && response.body?.access_token) {
      this.accessToken.set(response.body.access_token);
    } else {
      throw new Error("Failed to retrieve access token");
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

  /**
   * Validates if the given token is valid by verifying its signature and expiration.
   *
   * @param {WritableSignal<string | null>} token - The JWT token signal to validate
   */
  private validateAccessTokenEffect(token: WritableSignal<string | null>) {
    return effect(async () => {
      try {
        const url = `${this.authApiUrl}/v1/verify`;
        const response = await firstValueFrom(this.http.post<{message: string}>(url, { token }, { observe: "response" }));

        if (response.status != 200) {
          throw new Error(response.body?.message);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        token.set(null);
      }
    });
  }
}
