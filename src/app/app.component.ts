import { Component } from '@angular/core';
<<<<<<< Updated upstream
import { RouterModule } from '@angular/router'; // ✅ Needed for routerLink, routerLinkActive, routerLinkActiveOptions
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

=======
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Add this
import { filter } from 'rxjs/operators';
>>>>>>> Stashed changes

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< Updated upstream
  imports: [RouterModule, RouterOutlet,FooterComponent], // ✅ Include both
=======
  imports: [CommonModule, RouterModule, RouterOutlet], // ✅ Include CommonModule here
>>>>>>> Stashed changes
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wildlife';
  isHomepage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomepage = event.urlAfterRedirects === '/';
      });
  }
}
