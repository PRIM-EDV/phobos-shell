import { CommonModule } from '@angular/common';
import { Component, effect, inject } from "@angular/core";
import { Router } from "@angular/router";
import { PhSidebar, PhSidebarItem, PhTopbar, PhTopbarHeader, PhTopbarItem } from "@phobos/elements";

import { AuthzService } from "../auth/authz.service";
import { AuthService } from '../auth/auth.service';
import { NavigationService } from './navigation/navigation.service';
import { View } from './navigation/interfaces/view.interface';

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
    const defaultRoute = this.getDefaultRoute(views);

    this.router.navigate([defaultRoute ?? ""]);
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

  public isAuthorizedView(view: View): boolean {
    return view.tabs.some(tab => tab.roles.length === 0 || this.authz.hasRole(tab.roles));
  }

  private getDefaultRoute(views: View[]): string | undefined {
    return views.flatMap(view => view.tabs).find(tab => this.authz.hasRole(tab.roles))?.route;
  }
}
