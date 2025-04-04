import { Component, Input } from '@angular/core';
import { Cart } from '../../services/cart.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormatDatePipe } from '../../helpers/pipes/format-date.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-resume-item',
  imports: [CurrencyPipe, TuiIcon, TuiButton, RouterLink, NgClass],
  templateUrl: './checkout-resume-item.component.html',
  styleUrl: './checkout-resume-item.component.scss',
})
export class CheckoutResumeItemComponent {
  @Input({ required: true }) item!: Cart;
  @Input() sale!: string;
  @Input() view: {
    ticket: boolean;
  } = {
    ticket: false,
  };

  goTo() {
    if (!this.item.product.is_visible && !this.item.product.is_deleted) return;
    location.href = `/categoria/${this.item.product.categories.slug}/${this.item.product.slug}`;
  }
}
