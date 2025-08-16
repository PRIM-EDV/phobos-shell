import { Component, effect, signal, WritableSignal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";
import { filter } from "rxjs";
import { AuthzService } from "./auth/authz.service";
import { AuthService } from "./auth/auth.service";


declare global {
  interface Window {
    __env?: {
      PHOBOS_AUTH_URL?: string;
    };
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
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

  constructor(
    private readonly auth: AuthService,
    private readonly authz: AuthzService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.currentUrl.set(e.urlAfterRedirects);
    });
  }

  private async redirectToUserLanding(): Promise<void> {
    switch (true) {
      case this.authz.hasRole('admin'):
        await this.router.navigate(['/lsx/general']); break;
      case this.authz.hasRole('tacop'):
        await this.router.navigate(['/maptool/map']); break;
    }
  }
}
