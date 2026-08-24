import { Injectable, Signal, WritableSignal, computed, effect, signal } from "@angular/core";
import { PowerDevice, PowerState } from "@phobos-lsx/protocol";

import { AuthzService } from "../auth/authz.service";
import { OverlayRpcAdapter } from "./infrastructure/overlay.rpc.adapter";
import { LsxGateway } from "../infrastructure/gateway/lsx/lsx.gateway";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  public readonly maptoolPowerState: WritableSignal<PowerState> = signal(PowerState.POWER_STATE_POWERED);

  powerStateInit = effect(async () => {
    if (this.gateway.isConnected()) {
      const cicPowerState = await this.rpc.getDevicePowerState(PowerDevice.DEVICE_CIC_MAPTOOL);
      this.maptoolPowerState.set(cicPowerState);
    }
  });

  constructor(
    private readonly authz: AuthzService,
    private readonly gateway: LsxGateway,
    private readonly rpc: OverlayRpcAdapter
  ) { }

}
