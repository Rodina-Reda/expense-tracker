import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Persistent header/navbar shown on every page (rendered once in
 * AppComponent, outside the <router-outlet>). Highlights the active
 * route via routerLinkActive.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">💰 Expense Tracker</div>
      <ul class="navbar-links">
        <li>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Home
          </a>
        </li>
        <li><a routerLink="/add" routerLinkActive="active">Add Expense</a></li>
        <li><a routerLink="/expenses" routerLinkActive="active">All Expenses</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: #1f2937;
      color: white;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .navbar-brand {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .navbar-links {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      margin: 0;
      padding: 0;
    }
    .navbar-links a {
      color: #d1d5db;
      text-decoration: none;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .navbar-links a:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }
    .navbar-links a.active {
      color: white;
      background: #4f46e5;
    }
  `],
})
export class NavbarComponent {}
