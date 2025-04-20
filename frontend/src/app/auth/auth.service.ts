import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

const PHOBOS_AUTH_URL = window.__env.phobosAuthUrl ? window.__env.phobosAuthUrl : 'http://localhost:3100';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated: WritableSignal<boolean> = signal(false);

  private codeVerifier: string = '';

  constructor(private http: HttpClient) {
    this.authenticate()
   }

  public async authenticate(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if the user is already authenticated

    // Check if the url contains a code parameter
    const code = urlParams.get('code');

    console.log("Auth")
    // If not, start the OAuth2 authorization flow
    await this.startOauthSession();
  }

  public async startOauthSession(): Promise<void> {
    const clientId = 'webapp';
    const codeVerifier = this.generateCodeVerifier(128);
    const codeChallenge = this.generateCodeChallenge(codeVerifier);
    const url = `${PHOBOS_AUTH_URL}/auth/authorize?response_type=code&client_id=${clientId}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    
    // console.log(await this.http.get<any>(url).toPromise());

    // this.codeVerifier = codeVerifier;
    sessionStorage.setItem("codeVerifier", codeVerifier);
    window.location.href = url;
  }

  public async getAccessToken(code: string): Promise<string> {
    const clientId = 'webapp';
    const url = `${window.location.origin}/api/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: window.location.origin,
      client_id: clientId,
      code_verifier: this.codeVerifier
    });

    const response = await this.http.post<any>(url, body.toString(), { withCredentials: true }).toPromise();

    return response.access_token;
  }

  private generateCodeVerifier(length: number = 128): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    
    crypto.getRandomValues(randomValues);
  
    return Array.from(randomValues)
      .map(byte => charset[byte % charset.length])  // Wähle Zeichen aus charset basierend auf Zufallswert
      .join('');
  }
  

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const encodedVerifier = encoder.encode(codeVerifier);

    // SHA-256 Hashing
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedVerifier);
    const base64url = btoa(String.fromCharCode(...new Uint8Array(hashBuffer))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return base64url;
  }
}
