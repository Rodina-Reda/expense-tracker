# Expense Tracker (Angular 22, Standalone)

A mini-project expense tracker built with Angular's standalone component
APIs, Signals, Reactive Forms, a custom pipe, and a custom directive.

## Features

- **Home** (`/`) — landing page with a CTA into the Add Expense form.
- **Add / Edit** (`/add`, `/edit/:id`) — one reactive form component reused
  for both create and update flows, with a custom "no future dates"
  validator.
- **All Expenses** (`/expenses`) — filter by category, search by note,
  sort by date/amount (asc/desc), running total, empty state, and
  edit/delete row actions. All filtering/sorting is done reactively with
  Angular Signals + `computed()`.
- **`categoryIcon` pipe** — decorates each category with an emoji.
- **`appHighlightOverBudget` directive** — highlights table rows whose
  amount exceeds a configurable threshold (default $100).
- **Budget Buddy chatbot** — a floating chat widget with message history,
  Enter-to-send, and a loading indicator (currently simulated locally;
  see the comment in `chatbot.component.ts` for wiring up a real AI API).

## Project structure

```
src/app/
  models/expense.model.ts
  services/expense.service.ts
  pipes/category-icon.pipe.ts
  directives/highlight-over-budget.directive.ts
  components/
    navbar/navbar.component.ts
    home/home.component.ts
    expense-form/expense-form.component.ts
    expense-list/expense-list.component.ts
    chatbot/chatbot.component.ts
  app.component.ts
  app.routes.ts
  app.config.ts
src/main.ts
src/index.html
src/styles.css
db.json           <- mock data for json-server
```

## Running it

This project expects a REST API at `http://localhost:3000/expenses`.
The included `db.json` + `json-server` gives you that for free.

1. Install dependencies:
   ```bash
   npm install
   ```
2. In one terminal, start the mock API:
   ```bash
   npm run api
   ```
   This serves `db.json` at `http://localhost:3000`, so
   `GET/POST/PUT/DELETE http://localhost:3000/expenses[/:id]` all work.
3. In another terminal, start the Angular dev server:
   ```bash
   npm start
   ```
4. Open the app at `http://localhost:4200`.

## Notes

- Swap `db.json`/`json-server` for any real backend that exposes the same
  `expenses` REST resource shape — `ExpenseService` doesn't need to change.
- The chatbot's replies are simulated client-side; replace the `setTimeout`
  block in `ChatbotComponent.sendMessage()` with an `HttpClient` call to a
  real AI endpoint to make it live.
