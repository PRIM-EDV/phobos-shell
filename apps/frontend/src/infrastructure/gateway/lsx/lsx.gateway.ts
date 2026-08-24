import { Inject, Injectable, Optional } from "@angular/core";

import { RpcGateway } from "@phobos/common";
import { MFE_REGISTRY_SERVICE_TOKEN, IRegistryService } from "@phobos/core";
import { LsxMessage, Request, Response } from "@phobos-lsx/protocol";

import { LsxGatewayConfig } from "./lsx.gateway.config";


@Injectable(
  { providedIn: 'root' }
)
export class LsxGateway extends RpcGateway<LsxMessage, Request, Response> {
  protected override apiUrl: string = "";

  constructor(
    @Optional() @Inject(MFE_REGISTRY_SERVICE_TOKEN) private registry: IRegistryService
  ) {
    super(LsxMessage);
    this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    const lsxProvider = this.registry?.find({ name: 'phobos-lsx' });

    if (lsxProvider) {
      return lsxProvider[0].apiUrl.toString();
    }
    return LsxGatewayConfig.defaultApiUrl;
  }
}
