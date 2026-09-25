import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Expense } from '../models/expense.model';

/**
 * ExpenseService centralizes all communication with the REST API
 * (json-server at http://localhost:3000/expenses) and exposes the
 * current list of expenses as a reactive Signal so components can
 * read it directly in templates / computed() without manual subscriptions.
 */
@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly apiUrl = 'http://localhost:3000/expenses';

  /** Single source of truth for the app's expense list. */
  expenses = signal<Expense[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Fetches every expense from the API and refreshes the `expenses` signal.
   * Components should subscribe once (e.g. in ngOnInit) to trigger the load;
   * afterwards they can just read the `expenses` signal reactively.
   */
  getExpenses(): Observable<Expense[]> {
    return this.http
      .get<Expense[]>(this.apiUrl)
      .pipe(tap((data) => this.expenses.set(data)));
  }

  /** Fetches a single expense by id — used to pre-fill the edit form. */
  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  /** Creates a new expense and appends it to the local signal on success. */
  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http
      .post<Expense>(this.apiUrl, expense)
      .pipe(tap((created) => this.expenses.update((list) => [...list, created])));
  }

  /** Updates an existing expense and patches it into the local signal. */
  updateExpense(id: number, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense).pipe(
      tap((updated) =>
        this.expenses.update((list) => list.map((e) => (e.id === id ? updated : e)))
      )
    );
  }

  /** Deletes an expense and removes it from the local signal. */
  deleteExpense(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.expenses.update((list) => list.filter((e) => e.id !== id))));
  }
}
