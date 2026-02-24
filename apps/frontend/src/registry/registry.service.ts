import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRegistryService, Mfe } from "@phobos/core";

import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RegistryService implements IRegistryService {

  private mfes: Mfe[] = [];

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public async hydrate(): Promise<void> {
    try {
      const federationManifestResponse = await firstValueFrom(this.httpClient.get<Record<string, string>>('federation.manifest.json'));
      const phobosManifestResponse = await firstValueFrom(this.httpClient.get<Record<string, string>>('phobos.manifest.json'));

      const federationManifest: Record<string, string> = federationManifestResponse;
      const phobosManifest: Record<string, string> = phobosManifestResponse;

      const remotes = Object.keys(federationManifest).map(name => ({
        name,
        remoteUrl: federationManifest[name],
        remotePath: phobosManifest[name]
      }));

      this.mfes = remotes.map(remote => {
        const origin = (new URL(remote.remoteUrl)).origin;
        return {
          name: remote.name,
          apiUrl: new URL(remote.remotePath + '/api', origin),
          baseUrl: new URL(remote.remotePath, origin),
          features: {
            auth: false
          }
        };
      });
    } catch (error) {
      console.error('Error loading manifest routes:', error);
    }
  }


  public find(query: Partial<Mfe>): Mfe[] {
    return this.mfes.filter(mfe => this.deepMatch(mfe, query));
  }


  private deepMatch(target: any, query: any): boolean {
    if (query === null || typeof query !== 'object') {
      return target === query;
    }

    return Object.keys(query).every(key => {
      const queryVal = query[key];

      if (queryVal === undefined) return true;

      return this.deepMatch(target[key], queryVal);
    });
  }
}
