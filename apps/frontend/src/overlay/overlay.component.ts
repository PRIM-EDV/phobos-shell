import { Component, effect, HostBinding } from '@angular/core';
import { PowerState } from '@phobos-lsx/protocol';

import { OverlayService } from './overlay.service';
import { OverlayApiService } from './api/overlay.api.service';
import { AuthzService } from '../auth/authz.service';


@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {

  @HostBinding('style.display') public display: string = 'none';

  displayEffect = effect(() => {
    this.display = this.getMaptoolPowerOfflineDisplayState() ? 'unset' : 'none';
  });

  header: string = 'System Power Error';
  message: string = 'A critical power loss within the section has been detected. The system is shutting down to prevent data loss and hardware damage. Further information on the problem is collected and will be sent to the technical support section and system administrator. Please remain patient and wait for the problem beeing resolved. ';

  constructor(
    private readonly api: OverlayApiService,
    private readonly authz: AuthzService,
    private readonly service: OverlayService
  ) {
  }

  private getMaptoolPowerOfflineDisplayState(): boolean {
    const hasTacopRole = this.authz.hasRole(['tacop']);
    const maptoolPowerState = this.service.maptoolPowerState();
    return hasTacopRole && (maptoolPowerState !== PowerState.POWER_STATE_POWERED);
  }
}
