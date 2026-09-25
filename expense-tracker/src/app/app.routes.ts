import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Expense Tracker - Home' },
  { path: 'add', component: ExpenseFormComponent, title: 'Add Expense' },
  { path: 'expenses', component: ExpenseListComponent, title: 'All Expenses' },
  // Reuses ExpenseFormComponent for editing; the component checks the
  // route's :id param at runtime to switch into edit mode.
  { path: 'edit/:id', component: ExpenseFormComponent, title: 'Edit Expense' },
  { path: '**', redirectTo: '' },
];
