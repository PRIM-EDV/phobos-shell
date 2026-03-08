import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, inject } from "@angular/core";
import { Router } from "@angular/router";
import { PhSidebar, PhSidebarItem, PhTopbar, PhTopbarHeader, PhTopbarItem } from "@phobos/elements";

import { AuthzService } from "../auth/authz.service";
import { AuthService } from '../auth/auth.service';
import { NavigationService } from './navigation/navigation.service';

@Component({
  selector: "app-shell",
  imports: [
    CommonModule,
    PhTopbar,
    PhTopbarHeader,
    PhTopbarItem,
    PhSidebar,
    PhSidebarItem],
  standalone: true,
  templateUrl: "./shell.component.html",
  styleUrls: ["./shell.component.scss"],
})
export class ShellComponent {
  public readonly authz = inject(AuthzService);
  public readonly navigation = inject(NavigationService);

  private navigateToDefaultEffect = effect(() => {
    const views = this.navigation.views();
    if (views.length > 0) {
      const defaultView = views[0];
      if (defaultView.tabs.length > 0) {
        this.navigate(defaultView.tabs[0].route);
      }
    }
  });

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router)
  { }

  public logout(): void {
    this.auth.logout();
  }

  public navigate(view: string): void {
    this.router.navigate([view]);
  }
}
