import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Landing page shown at the '/' route: a short pitch for the app
 * plus a call-to-action button that routes to the Add Expense form.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <h1>Take control of your spending 💸</h1>
      <p>
        Track every expense in one place, spot spending patterns by category,
        and stay on top of your budget — all in a fast, simple interface.
      </p>
      <a routerLink="/add" class="cta-button">+ Add Your First Expense</a>
    </section>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 4rem 1rem;
    }
    .hero h1 {
      font-size: 2.25rem;
      margin-bottom: 1rem;
      color: #111827;
    }
    .hero p {
      font-size: 1.1rem;
      color: #6b7280;
      max-width: 520px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: #4f46e5;
      color: white;
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s ease;
    }
    .cta-button:hover {
      background: #4338ca;
    }
  `],
})
export class HomeComponent {}
