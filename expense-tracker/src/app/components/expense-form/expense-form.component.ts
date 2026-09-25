import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseCategory } from '../../models/expense.model';

/**
 * Custom validator that rejects any date later than "today".
 * Time is zeroed out to end-of-day so today's date itself is always valid,
 * regardless of the time the form happens to be submitted.
 */
function noFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return selected > endOfToday ? { futureDate: true } : null;
  };
}

/**
 * Single form component used for BOTH creating a new expense ('/add')
 * and editing an existing one ('/edit/:id'). Edit mode is detected via
 * the presence of an ':id' route param, at which point the form is
 * pre-filled via patchValue() and the submit button label/behavior switch.
 */
@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-card">
      <h2>{{ isEditMode() ? 'Edit Expense' : 'Add Expense' }}</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Amount -->
        <div class="field">
          <label for="amount">Amount ($)</label>
          <input id="amount" type="number" step="0.01" formControlName="amount" placeholder="0.00" />
          @if (form.get('amount')?.touched && form.get('amount')?.invalid) {
            <small class="error">
              @if (form.get('amount')?.errors?.['required']) {
                Amount is required.
              } @else if (form.get('amount')?.errors?.['min']) {
                Amount must be greater than 0.
              }
            </small>
          }
        </div>

        <!-- Category -->
        <div class="field">
          <label for="category">Category</label>
          <select id="category" formControlName="category">
            <option value="" disabled>Select a category</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
          @if (form.get('category')?.touched && form.get('category')?.invalid) {
            <small class="error">Category is required.</small>
          }
        </div>

        <!-- Date -->
        <div class="field">
          <label for="date">Date</label>
          <input id="date" type="date" formControlName="date" />
          @if (form.get('date')?.touched && form.get('date')?.invalid) {
            <small class="error">
              @if (form.get('date')?.errors?.['required']) {
                Date is required.
              } @else if (form.get('date')?.errors?.['futureDate']) {
                Date cannot be in the future.
              }
            </small>
          }
        </div>

        <!-- Note -->
        <div class="field">
          <label for="note">Note (optional)</label>
          <textarea
            id="note"
            formControlName="note"
            maxlength="200"
            rows="3"
            placeholder="e.g. Grocery run"
          ></textarea>
          <small class="hint">{{ form.get('note')?.value?.length || 0 }}/200</small>
          @if (form.get('note')?.touched && form.get('note')?.invalid) {
            <small class="error">Note cannot exceed 200 characters.</small>
          }
        </div>

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Saving...' : isEditMode() ? 'Update' : 'Add' }}
          </button>
          <a routerLink="/expenses" class="cancel-link">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-card {
      max-width: 480px;
      margin: 0 auto;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 2rem;
    }
    h2 { margin-top: 0; color: #111827; }
    .field {
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    label { font-weight: 600; font-size: 0.9rem; color: #374151; }
    input, select, textarea {
      padding: 0.6rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
    }
    textarea { resize: vertical; }
    .hint { color: #9ca3af; align-self: flex-end; }
    .error { color: #dc2626; }
    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    button {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 0.65rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
    button:disabled { background: #a5a6f6; cursor: not-allowed; }
    .cancel-link { color: #6b7280; text-decoration: none; }
    .cancel-link:hover { text-decoration: underline; }
  `],
})
export class ExpenseFormComponent implements OnInit {
  categories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other',
  ];

  form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: ['' as ExpenseCategory | '', Validators.required],
    date: ['', [Validators.required, noFutureDateValidator()]],
    note: ['', Validators.maxLength(200)],
  });

  /** True when editing an existing expense (an :id route param is present). */
  isEditMode = signal(false);
  /** Disables the submit button while the save request is in flight. */
  submitting = signal(false);

  private editId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = Number(idParam);
      this.isEditMode.set(true);
      this.expenseService.getExpenseById(this.editId).subscribe((expense) => {
        // Pre-fill the form with the existing record's values.
        this.form.patchValue({
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          note: expense.note ?? '',
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const payload = {
      amount: Number(this.form.value.amount),
      category: this.form.value.category as ExpenseCategory,
      date: this.form.value.date as string,
      note: this.form.value.note || undefined,
    };

    const request$ = this.isEditMode()
      ? this.expenseService.updateExpense(this.editId as number, payload)
      : this.expenseService.addExpense(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/expenses']),
      error: (err) => {
        console.error('Failed to save expense', err);
        this.submitting.set(false);
      },
    });
  }
}
