import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Needed for routerLink, routerLinkActive, routerLinkActiveOptions
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet], // ✅ Include both
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ✅ typo fix: should be styleUrls, not styleUrl
})
export class AppComponent {
  title = 'wildlife';
}
