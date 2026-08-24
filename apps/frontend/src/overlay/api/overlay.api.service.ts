import { Injectable } from "@angular/core";

import { PowerDevice, SetDevicePowerState_Request, Request } from "@phobos-lsx/protocol";
import { Subscription } from "rxjs";

import { LsxGateway } from "../../infrastructure/gateway/lsx/lsx.gateway";
import { OverlayService } from "../overlay.service";

@Injectable({
  providedIn: 'root'
})
export class OverlayApiService {

  private onRequestSubscription: Subscription;

  constructor(
    private readonly gateway: LsxGateway,
    private readonly overlayService: OverlayService
  ) {
    this.onRequestSubscription = gateway.onRequest.subscribe(this.handleRequest.bind(this));
  }

  private async setDevicePowerState(request: SetDevicePowerState_Request) {
    if (request.device === PowerDevice.DEVICE_CIC_MAPTOOL) {
      this.overlayService.maptoolPowerState.set(request.state);
    }
  }

  private async handleRequest(e: { id: string, request: Request }) {
    const method = Object.keys(e.request).find(key => (e.request as any)[key] !== undefined);
    if (method) {
      const args = (e.request as any)[method] as any
      if (typeof (this as any)[method] === 'function') {
        const res = await (this as any)[method](args);
        this.gateway.respond(e.id, res);
      }
    }
  }
}