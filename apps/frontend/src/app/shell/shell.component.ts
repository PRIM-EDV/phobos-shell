import { Component, computed, Signal, signal, WritableSignal } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { PhSidebar, PhSidebarItem, PhTopbar, PhTopbarHeader, PhTopbarItem } from "@phobos/elements";

import { filter } from "rxjs";

@Component({
  selector: "app-shell",
  imports: [PhTopbar, PhTopbarHeader, PhTopbarItem, PhSidebar, PhSidebarItem],
  standalone: true,
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.scss",
})
export class ShellComponent {
  public view: Signal<string> = computed(() => {
    const url = this.currentUrl();
    const parts = url.split("/").filter(Boolean);
    switch (parts[0]) {
      case "maptool":
        return "TACOP";
      default:
        return "";
    }
  });

  public tab: Signal<string> = computed(() => {
    const url = this.currentUrl();
    const parts = url.split("/").filter(Boolean);
    switch (parts[1]) {
      case "map":
        return "MAP";
      case "squad":
        return "SQUAD";
      default:
        return "";
    }
  });

  private currentUrl: WritableSignal<string> = signal("");

  constructor(private readonly router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.currentUrl.set((event as NavigationEnd).urlAfterRedirects);
    });
  }

  public navigate(view: string): void {
    this.router.navigate([view]);
  }
}
