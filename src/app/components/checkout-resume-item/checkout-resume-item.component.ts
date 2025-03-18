import { Component, Input } from '@angular/core';
import { Cart } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormatDatePipe } from '../../helpers/pipes/format-date.pipe';

@Component({
  selector: 'app-checkout-resume-item',
  imports: [CurrencyPipe, TuiIcon, TuiButton],
  templateUrl: './checkout-resume-item.component.html',
  styleUrl: './checkout-resume-item.component.scss',
})
export class CheckoutResumeItemComponent {
  @Input({ required: true }) item!: Cart;
  @Input() view: {
    ticket: boolean;
  } = {
    ticket: false,
  };
}
