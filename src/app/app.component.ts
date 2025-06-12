import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Nimbus Cloud Platform';
  currentYear: number = new Date().getFullYear();
  
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Handle route changes
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          // Scroll to top on route change
          window.scrollTo(0, 0);
          
          // Update page title based on route
          const route = this.router.url.split('/')[1];
          this.title = route 
            ? route.charAt(0).toUpperCase() + route.slice(1) + ' | Nimbus'
            : 'Nimbus';
            
          console.debug('Navigation:', this.router.url);
        });
    }
  }
}
