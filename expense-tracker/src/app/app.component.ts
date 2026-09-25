import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

/**
 * Root component. The Navbar and Chatbot are rendered here (outside the
 * router-outlet) so they persist across every route change.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ChatbotComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="page-content">
      <router-outlet></router-outlet>
    </main>
    <app-chatbot></app-chatbot>
  `,
  styles: [`
    .page-content {
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      min-height: calc(100vh - 64px);
    }
  `],
})
export class AppComponent {}
