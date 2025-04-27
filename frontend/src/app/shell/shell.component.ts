import { Component } from '@angular/core';
import { PhElementsModule } from '../../../lib/ph-elements/ph-elements.module';

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
}
