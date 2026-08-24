import { Component, effect, signal, WritableSignal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";
import { filter } from "rxjs";
import { AuthzService } from "./auth/authz.service";
import { AuthService } from "./auth/auth.service";
import { TokenService } from "./auth/token.service";
import { LsxGateway } from "./infrastructure/gateway/lsx/lsx.gateway";
import { OverlayComponent } from "./overlay/overlay.component";


declare global {
  interface Window {
    __env?: {
      PHOBOS_AUTH_URL?: string;
      LSX_SERVER_HOSTNAME?: string;
      LSX_SERVER_PORT?: string;
    };
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ShellComponent, OverlayComponent],
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  title = "phobos-shell";

  private currentUrl: WritableSignal<string> = signal("");

  redirect = effect(async () => {
    if (this.auth.isAuthenticated() && this.currentUrl() === "/") {
      await this.redirectToUserLanding();
    }
  });

  autoLsxGatewayConnection = effect(async () => {
    if (this.tokenService.accessToken() && !this.lsxGateway.isConnected()) {
      await this.connectToLsxGateway();
    }
  });

  constructor(
    private readonly auth: AuthService,
    private readonly authz: AuthzService,
    private readonly tokenService: TokenService,
    private readonly lsxGateway: LsxGateway,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.currentUrl.set(e.urlAfterRedirects);
    });
  }

  private async redirectToUserLanding(): Promise<void> {
    // switch (true) {
    //   case this.authz.hasRole('admin'):
    //     await this.router.navigate(['/lsx/general']); break;
    //   case this.authz.hasRole('tacop'):
    //     await this.router.navigate(['/maptool/map']); break;
    // }
  }

  private async connectToLsxGateway(): Promise<void> {
    const token = this.tokenService.accessToken() || '';
    if (token) {
      try {
        await this.lsxGateway.connect(token);
        console.debug('Connected to Lsx Gateway');
      } catch (error) {
        console.error('Error connecting to Lsx Gateway:', error);
        setTimeout(async () => {
          await this.connectToLsxGateway();
        }, 30000);
      }
    }
  }
}
