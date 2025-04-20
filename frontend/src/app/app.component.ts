import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { EventEmitter2 } from 'eventemitter2';
import  EventEmitter2  from 'eventemitter2';

declare global {
  interface Window { 
    emitter: EventEmitter2;
  }
}

window.emitter = new EventEmitter2();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'phobos-shell';

  constructor() {
    
  }
}
