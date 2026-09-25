import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseCategory } from '../models/expense.model';

/**
 * Transforms a raw ExpenseCategory string into a friendlier,
 * emoji-prefixed label for display in templates.
 *
 * Usage: {{ expense.category | categoryIcon }}
 *   'Food' -> '🍔 Food'
 */
@Pipe({
  name: 'categoryIcon',
  standalone: true,
})
export class CategoryIconPipe implements PipeTransform {
  private readonly icons: Record<ExpenseCategory, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '📄',
    Entertainment: '🎬',
    Other: '📦',
  };

  transform(category: ExpenseCategory): string {
    const icon = this.icons[category] ?? '📦';
    return `${icon} ${category}`;
  }
}
