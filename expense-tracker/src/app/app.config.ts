import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Root application configuration for the standalone bootstrap.
 * Registers the router (with our route table) and HttpClient
 * (needed by ExpenseService to talk to the json-server API).
 */
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};
