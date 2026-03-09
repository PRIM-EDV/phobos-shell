import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { NavigationEnd, Route, Router } from "@angular/router";
import { loadRemoteModule } from "@angular-architects/native-federation";
import { Mfe } from "@phobos/core";

import { filter } from "rxjs";

import { RegistryService } from "../../registry/registry.service";
import { View } from "./interfaces/view.interface";
import { Tab } from "./interfaces/tab.interface";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  /**
   * List of views and their associated tabs, loaded from remote modules.
   */
  public views = signal<View[]>([]);

  /**
   * Current active tab based on the current URL and views.
   */
  public tab = computed(() => {
    const match = this.routingTable().find((entry) => this.currentUrl().startsWith(entry.route));
    return match ? match.tab : null;
  });

  /**
   * Current active view based on the current URL and views.
   */
  public view = computed(() => {
    const match = this.routingTable().find((entry) => this.currentUrl().startsWith(entry.route));
    return match ? match.view : null;
  });

  private readonly currentUrl = signal("");
  private readonly routingTable = computed(() => this.views().flatMap(view => view.tabs.map(tab => ({ route: tab.route, view, tab }))));

  constructor(
    private readonly registryService: RegistryService,
    private readonly router: Router
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.currentUrl.set((event as NavigationEnd).urlAfterRedirects);
    });

    this.initializeNavigation();
  }

  private async initializeNavigation(): Promise<void> {
    const remotes = this.registryService.find({});

    await Promise.all(remotes.map(async (remote) => {
      try {
        const routes = await this.fetchRemoteRoutes(remote);
        routes.forEach((route) => {
          const base = this.removePathPrefix(remote.baseUrl.pathname, '/app');
          this.updateViews(route, base);
        });
      } catch (error) {
        console.error(`Skipping navigation for remote [${remote.name}]:`, error);
      }
    }));
  }

  /**
   * Fetches the routes from a remote module.
   * @param remote The remote module from which to fetch routes.
   * @returns A promise that resolves to an array of routes.
   */
  private async fetchRemoteRoutes(remote: Mfe): Promise<Route[]> {
    try {
      const { routes } = await loadRemoteModule(remote.name, './Routes');
      return routes.filter((r: Route) => r.data?.["view"] && r.data?.["tab"]);
    } catch (error) {
      return [];
    }
  }

  /**
   * Removes the specified prefix from the given path if it exists.
   * @param path The path from which to remove the prefix.
   * @param prefix The prefix to remove.
   * @returns The path without the prefix if it was present, otherwise the original path.
   */
  private removePathPrefix(path: string, prefix: string): string {
    if (path.startsWith(prefix)) {
      return path.substring(prefix.length);
    }
    return path;
  }

  /**
   * Updates the views and tabs based on the provided route and base path.
   * @param route The route object containing view and tab information.
   * @param base The base path for the route.
   */
  private updateViews(route: Route, base: string): void {
    const view: View = { name: route.data?.["view"], baseRoute: base, tabs: [] };
    const tab: Tab = { name: route.data?.["tab"], route: `${base}/${route.path}`, roles: route.data?.["roles"] || [] };
    this.views.update((views) => {
      const existingView = views.find((v) => v.name === view.name);

      if (existingView) {
        if (!existingView.tabs.some((t) => t.name === tab.name)) {
          existingView.tabs.push(tab);
        }
      } else {
        views.push({ ...view, tabs: [tab] });
      }
      return [...views];
    });
  }
}