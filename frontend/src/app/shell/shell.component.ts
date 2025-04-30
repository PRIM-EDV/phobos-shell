import { Component, signal, WritableSignal } from '@angular/core';
import { PhElementsModule } from '../../../lib/ph-elements/ph-elements.module';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shell',
  imports: [
    PhElementsModule
  ],
  standalone: true,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  public view: string = 'home';
  public tab: string = 'home';

  private currentUrl: WritableSignal<string> = signal('');

  constructor(private readonly router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      const url = (event as NavigationEnd).urlAfterRedirects;
    });
  }
}
