/**
 * Authentication service that manages user authentication via OAuth2 with PKCE flow.
 * 
 * This service is responsible for:
 * - Tracking the user's authentication state
 * - Initiating the OAuth2 authorization code flow with PKCE
 * - Handling OAuth2 redirects after successful authentication
 * 
 * It works with an external authorization server defined by PHOBOS_AUTH_URL
 * environment variable.
 */
import { computed, effect, Injectable, Signal } from '@angular/core';
import { TokenService } from './token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PkceService } from './pkce.service';

const PHOBOS_AUTH_URL = window.__env?.PHOBOS_AUTH_URL ? window.__env?.PHOBOS_AUTH_URL : 'http://localhost:3000';
const clientId = 'webapp';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public isAuthenticated: Signal<boolean> = computed(() => {
    const accessToken = this.tokenService.accessToken();
    return accessToken !== null && accessToken !== undefined;
  });

  private autoAuthentication = effect(() => {
    if (!(this.isAuthenticated())) {
      this.authenticate();
    }
  })

  constructor(
    private readonly pkce: PkceService,
    private readonly tokenService: TokenService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
   ) { }

  /**
   * Authenticates the user.
   */
  public async authenticate(): Promise<void> {
    if (this.isAuthenticated()) {
      return;
    } else if (this.isOAuthRedirect()) {
      await this.handleOAuthRedirect();
    } else {
      await this.startOAuthFlow();
    }
  }

  /**
   * Handles the OAuth2 redirect after the user has authorized the application.
   * 
   * Retrieves the authorization code and verifier from the URL and session storage,
   * then requests an access token using these values.
   */
  public async handleOAuthRedirect(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const verifier = sessionStorage.getItem("pkce.verifier");

    if (code && verifier) {
      await this.removeQueryParams();
      await this.tokenService.requestAccessToken(code, verifier);
    } else {
      throw new Error('Invalid OAuth redirect: missing code or verifier');
    }
  }


  /**
   * Starts the OAuth2 authorization flow.
   * 
   * Generates a code verifier and challenge, stores the verifier in session storage,
   * and redirects the user to the authorization URL.
   */
  public async startOAuthFlow(): Promise<void> {
    const verifier = this.pkce.generateCodeVerifier(128);
    const challenge = await this.pkce.generateCodeChallenge(verifier);
    sessionStorage.setItem("pkce.verifier", verifier);
    
    const redirectUri = encodeURI(window.location.origin);
    const url = `${PHOBOS_AUTH_URL}/auth/authorize?response_type=code&client_id=${clientId}&code_challenge_method=S256&code_challenge=${challenge}&redirect_uri=${redirectUri}`;
    
    window.location.href = url;
  }

  private isOAuthRedirect(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return !!urlParams.get('code');
  }

  /**
   * Removes the query parameters from the URL.
   * 
   * Clears the URL of any query parameters after the OAuth2 redirect.
   */
  private async removeQueryParams(): Promise<void> {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: [],
      replaceUrl: true,
    });
  }
}
