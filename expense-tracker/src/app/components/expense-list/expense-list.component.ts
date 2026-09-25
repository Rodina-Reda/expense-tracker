import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseCategory } from '../../models/expense.model';
import { CategoryIconPipe } from '../../pipes/category-icon.pipe';
import { HighlightOverBudgetDirective } from '../../directives/highlight-over-budget.directive';

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

/**
 * Displays every expense in a table with live filtering (category + note
 * search), sorting, and a running total — all derived reactively from the
 * ExpenseService's `expenses` signal via computed().
 */
@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CategoryIconPipe, HighlightOverBudgetDirective],
  template: `
    <div class="list-page">
      <div class="header-row">
        <h2>All Expenses</h2>
        <a routerLink="/add" class="add-link">+ Add Expense</a>
      </div>

      <!-- Filter / search / sort controls, bound to signals via ngModel -->
      <div class="controls">
        <select
          class="control"
          [ngModel]="categoryFilter()"
          (ngModelChange)="categoryFilter.set($event)"
        >
          <option value="">All Categories</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>

        <input
          type="text"
          class="control"
          placeholder="Search by note..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
        />

        <select class="control" [ngModel]="sortField()" (ngModelChange)="sortField.set($event)">
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        <select
          class="control"
          [ngModel]="sortDirection()"
          (ngModelChange)="sortDirection.set($event)"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <!-- Running total of the currently filtered/visible expenses -->
      <div class="total-banner">
        Total ({{ filteredExpenses().length }}
        item{{ filteredExpenses().length === 1 ? '' : 's' }}):
        <strong>{{ total() | currency }}</strong>
      </div>

      @if (loading()) {
        <p class="status-text">Loading expenses...</p>
      } @else if (filteredExpenses().length === 0) {
        <div class="empty-state">
          <p>No expenses found. Try adjusting your filters, or add a new expense.</p>
          <a routerLink="/add" class="add-link">+ Add Expense</a>
        </div>
      } @else {
        <table class="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Note</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (expense of filteredExpenses(); track expense.id) {
              <!-- Row is highlighted by the custom directive when amount > 100 -->
              <tr [appHighlightOverBudget] [amount]="expense.amount" [threshold]="100">
                <td>{{ expense.date }}</td>
                <td>{{ expense.category | categoryIcon }}</td>
                <td>{{ expense.note || '—' }}</td>
                <td>{{ expense.amount | currency }}</td>
                <td class="actions-cell">
                  <a [routerLink]="['/edit', expense.id]" class="edit-btn">Edit</a>
                  <button (click)="onDelete(expense.id)" class="delete-btn">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`
    .list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-row { display: flex; justify-content: space-between; align-items: center; }
    h2 { margin: 0; color: #111827; }
    .add-link {
      background: #4f46e5;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .controls { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .control {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
      min-width: 160px;
      font-family: inherit;
    }
    .total-banner {
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      color: #3730a3;
    }
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #6b7280;
      border: 1px dashed #d1d5db;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .status-text { color: #6b7280; }
    .expense-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }
    .expense-table th, .expense-table td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.9rem;
    }
    .expense-table th {
      background: #f9fafb;
      color: #374151;
      font-weight: 600;
    }
    .actions-cell { display: flex; gap: 0.5rem; }
    .edit-btn, .delete-btn {
      border: none;
      border-radius: 5px;
      padding: 0.35rem 0.7rem;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }
    .edit-btn { background: #dbeafe; color: #1d4ed8; }
    .delete-btn { background: #fee2e2; color: #b91c1c; }
  `],
})
export class ExpenseListComponent implements OnInit {
  categories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other',
  ];

  loading = signal(true);

  // --- Filter / search / sort state, all Signals so the table stays
  // reactive to any combination of changes without manual re-computation. ---
  categoryFilter = signal<ExpenseCategory | ''>('');
  searchTerm = signal('');
  sortField = signal<SortField>('date');
  sortDirection = signal<SortDirection>('desc');

  /** Derived, always-up-to-date list applying category filter + search + sort. */
  filteredExpenses = computed(() => {
    const all = this.expenseService.expenses();
    const category = this.categoryFilter();
    const term = this.searchTerm().trim().toLowerCase();
    const field = this.sortField();
    const direction = this.sortDirection();

    const filtered = all.filter((e) => {
      const matchesCategory = category ? e.category === category : true;
      const matchesSearch = term ? (e.note ?? '').toLowerCase().includes(term) : true;
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const compareResult =
        field === 'date'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : a.amount - b.amount;
      return direction === 'asc' ? compareResult : -compareResult;
    });

    return sorted;
  });

  /** Running total of the currently filtered/visible expenses. */
  total = computed(() => this.filteredExpenses().reduce((sum, e) => sum + e.amount, 0));

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.expenseService.getExpenses().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.loading.set(false);
      },
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;
    this.expenseService.deleteExpense(id).subscribe({
      error: (err) => console.error('Failed to delete expense', err),
    });
  }
}
