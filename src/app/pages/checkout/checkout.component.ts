import { Component, inject } from '@angular/core';
import {
  TuiAlertService,
  TuiBreakpointService,
  TuiButton,
  TuiLoader,
} from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiConnected,
  TuiStep,
  TuiStepper,
} from '@taiga-ui/kit';
import { CheckoutResumeItemComponent } from '../../components/checkout-resume-item/checkout-resume-item.component';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { PaymentStatus, PayService } from '../../services/pay.service';
import { title } from 'process';
import { ItemCartComponent } from '../../components/item-cart/item-cart.component';
import { environment } from '../../../environments/environment';
import { showErrorMessage } from '../../helpers/build-error-messages';

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
    RouterLink,
    NgClass,
    TuiLoader,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly alerts = inject(TuiAlertService);

  protected readonly breakpoint$ = inject(TuiBreakpointService);

  activeIndex = 0;
  initPoint = '';
  loading = false;
  PaymentStatus = PaymentStatus;
  status: PaymentStatus | undefined;
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;

  constructor(
    public cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private payService: PayService,
  ) {}

  async ngOnInit() {
    const payment_id = this.route.snapshot.queryParamMap.get('payment_id');
    const status = this.route.snapshot.queryParamMap.get(
      'status',
    ) as PaymentStatus;
    const merchant_order_id =
      this.route.snapshot.queryParamMap.get('merchant_order_id');

    if (payment_id && status && merchant_order_id) {
      this.status = status;
      setTimeout(() => {
        this.activeIndex = status == PaymentStatus.approved ? 2 : 1;
      }, 200);

      if (status == PaymentStatus.approved) {
        this.cartService.clean();
      }
    }
  }

  toExplore() {
    this.router.navigate(['/explorar'], {
      queryParams: {
        page: 1,
      },
    });
  }

  reload() {
    if (this.status == PaymentStatus.pending) {
      location.reload();
    } else {
      location.href = '/carrito';
    }
  }

  // async getPaymentStatus() {
  //   this.loading = true;
  //   try {
  //     const res = await this.payService.getPaymentStatus(
  //       this.route.snapshot.queryParamMap.get('payment_id')!,
  //     );
  //   } catch (e: any) {
  //     showErrorMessage({
  //       baseMessage: 'Error al validar el pago',
  //       alert: this.alerts,
  //       errorApi: e?.message,
  //     });
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  async toPay() {
    this.loading = true;
    try {
      const items = this.cartService.items().map((item) => {
        return {
          id: item.product.id,
          quantity: item.quantity,
        };
      });

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
