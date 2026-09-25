import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

/**
 * Structural-style attribute directive applied to table rows (or any element)
 * to visually flag expenses that exceed a budget threshold.
 *
 * Usage:
 *   <tr [appHighlightOverBudget] [amount]="expense.amount" [threshold]="100">
 *
 * If `amount` is greater than `threshold`, the host element's background
 * is switched to a light red/orange to draw attention to it.
 */
@Directive({
  selector: '[appHighlightOverBudget]',
  standalone: true,
})
export class HighlightOverBudgetDirective implements OnChanges {
  /** The expense amount to evaluate against the threshold. */
  @Input() amount = 0;

  /** Amount above which the row is highlighted. Defaults to 100. */
  @Input() threshold = 100;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.amount > this.threshold) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#ffe4d6');
      this.renderer.setStyle(this.el.nativeElement, 'borderLeft', '4px solid #f97316');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
      this.renderer.removeStyle(this.el.nativeElement, 'borderLeft');
    }
  }
}
