/**
 * PKCE (Proof Key for Code Exchange) Service wich implements the PKCE extension for OAuth 2.0 authorization,
 * which helps prevent authorization code interception attacks.
 * 
 * The service provides methods to:
 * - Generate a code verifier (a cryptographically random string)
 * - Create a code challenge from the verifier using SHA-256 hashing
 * 
 */
import { Injectable } from '@angular/core';

import CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class PkceService {

  constructor() { }

  public generateCodeVerifier(length: number = 128): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    
    crypto.getRandomValues(randomValues);
  
    return Array.from(randomValues)
      .map(byte => charset[byte % charset.length])  // Wähle Zeichen aus charset basierend auf Zufallswert
      .join('');
  }

  public async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const encodedVerifier = encoder.encode(codeVerifier);

    // SHA-256 Hashing
    const hashBuffer = await this.digest(encodedVerifier);
    const base64url = btoa(String.fromCharCode(...new Uint8Array(hashBuffer))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return base64url;
  }

  
  private async digest(data: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
    if (crypto.subtle && typeof crypto.subtle.digest === 'function') {
      return crypto.subtle.digest('SHA-256', data);
    } else {
      const wordArray = CryptoJS.lib.WordArray.create(data);
      const hash = CryptoJS.SHA256(wordArray);
      const hashArray = new Uint8Array(hash.sigBytes);

      for (let i = 0; i < hash.sigBytes; i++) {
        hashArray[i] = (hash.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      }
      return hashArray.buffer;
    }
  }
}
