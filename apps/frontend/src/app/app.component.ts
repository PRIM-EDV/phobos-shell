import { Component } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";
import { filter } from "rxjs";
import { AuthzService } from "./auth/authz.service";
// import { EventEmitter2 } from 'eventemitter2';

declare global {
  interface Window {
    __env?: {
      phobosAuthUrl?: string;
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

  constructor(
    private readonly authz: AuthzService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(async (e: NavigationEnd) => {
      if (e.urlAfterRedirects === "/") {
        await this.redirectToUserLanding();
      }
    });
  }

  private async redirectToUserLanding(): Promise<void> {
    switch (true) {
      case await this.authz.hasRole('admin'):
        await this.router.navigate(['/maptool/map']);
    }
  }
}
