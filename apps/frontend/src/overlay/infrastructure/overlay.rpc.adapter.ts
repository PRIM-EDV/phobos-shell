import { Injectable } from "@angular/core";
import { GetDevicePowerState_Response, PowerDevice, PowerState, Request } from "@phobos-lsx/protocol";

import { LsxGateway } from "../../infrastructure/gateway/lsx/lsx.gateway";

@Injectable({
  providedIn: 'root'
})
export class OverlayRpcAdapter {
    constructor(
        private readonly gateway: LsxGateway
    ) { }

    public async getDevicePowerState(device: PowerDevice): Promise<PowerState> {
        const request: Request = {
            getDevicePowerState: {
                device: device
            }
        }
        const response = (await this.gateway.request(request)).getDevicePowerState as GetDevicePowerState_Response;

        return response.state;
    }
}