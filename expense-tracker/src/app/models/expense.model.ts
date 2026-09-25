/**
 * The fixed set of categories an expense can belong to.
 * Kept as a union type (rather than an enum) so it works cleanly
 * with Angular's template type-checking and JSON data from the API.
 */
export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Other';

/**
 * Shape of a single expense record as stored/returned by the API
 * (json-server running at http://localhost:3000/expenses).
 */
export interface Expense {
  /** Unique identifier, assigned by the backend */
  id: number;
  /** Monetary amount of the expense, always > 0 */
  amount: number;
  /** One of the fixed ExpenseCategory values */
  category: ExpenseCategory;
  /** ISO date string, e.g. '2026-09-25' */
  date: string;
  /** Optional free-text note, max 200 characters */
  note?: string;
}
