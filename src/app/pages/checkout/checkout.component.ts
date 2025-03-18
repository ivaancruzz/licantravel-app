import { Component, inject } from '@angular/core';
import { TuiBreakpointService, TuiButton } from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiConnected,
  TuiStep,
  TuiStepper,
} from '@taiga-ui/kit';
import { CheckoutResumeItemComponent } from '../../components/checkout-resume-item/checkout-resume-item.component';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { on } from 'events';
import { PayService } from '../../services/pay.service';
import { title } from 'process';
import { ItemCartComponent } from '../../components/item-cart/item-cart.component';

@Component({
  selector: 'app-checkout',
  imports: [
    TuiStep,
    TuiButton,
    TuiStepper,
    CheckoutResumeItemComponent,
    TuiButton,
    CurrencyPipe,
    AsyncPipe,
    TuiConnected,
    TuiButtonLoading,
    ItemCartComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  protected readonly breakpoint$ = inject(TuiBreakpointService);

  activeIndex = 0;
  initPoint = '';
  loading = false;

  constructor(
    public cartService: CartService,
    private router: Router,
    private payService: PayService,
  ) {}

  toExplore() {
    this.router.navigate(['/explorar'], {
      queryParams: {
        page: 1,
      },
    });
  }

  async toPay() {
    this.loading = true;
    try {
      const items = this.cartService.items().map((item) => ({
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const res = await this.payService.getPreference(items);
      this.initPoint = res.init_point;
      location.href = this.initPoint;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
