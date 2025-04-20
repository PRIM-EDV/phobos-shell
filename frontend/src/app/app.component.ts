import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
// import { EventEmitter2 } from 'eventemitter2';

declare global {
  interface Window {
    __env: {
      phobosAuthUrl: string,
    }
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'phobos-shell';

  constructor(
    private readonly auth: AuthService
  ) {
    
  }
}
