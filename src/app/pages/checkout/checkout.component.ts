import { Component, inject, signal } from '@angular/core';
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
import { PayService } from '../../services/pay.service';
import { title } from 'process';
import { ItemCartComponent } from '../../components/item-cart/item-cart.component';
import { environment } from '../../../environments/environment';
import { showErrorMessage } from '../../helpers/build-error-messages';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { UserService } from '../../services/user.service';
import { nanoid } from 'nanoid';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import { Observable, Subscription } from 'rxjs';
import { Database } from '../../lib/database.types';
import { PaymentStatus } from '../../services/sale.service';
import dayjs from 'dayjs';
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
  loading = false;
  PaymentStatus = PaymentStatus;
  status: PaymentStatus | undefined;
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
  payObservable!: Subscription;
  timerExpired = false;
  remainingTime = signal(0);
  expirationTime = dayjs().add(10, 'minute');
  constructor(
    public cartService: CartService,
    private userService: UserService,
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

  async toPay() {
    this.loading = true;
    try {
      const items: Items[] = this.cartService.items().map((item) => {
        return {
          id: item.product.id,
          title: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price_off || item.product.price,
        };
      });
      const requestId = nanoid();
      this.subscribeToPaymentUpdates(requestId);
      const res = await this.payService.getPreference(items, {
        request_id: requestId,
      });

      this.status = PaymentStatus.pending;
      this.activeIndex = 1;
      this.startTimer();
      window.open(res.init_point, '_blank');
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  private subscribeToPaymentUpdates(requestId: string) {
    // Desuscribirse de cualquier suscripción previa
    if (this.payObservable) {
      this.payObservable.unsubscribe();
    }

    // Crear una nueva suscripción
    this.payObservable = this.payService
      .getServerSentEvent('/mercadopago/sse/' + requestId)
      .subscribe({
        next: (event: any) => {
          const data: PaymentResponse = JSON.parse(event.data);
          console.log(data);

          this.status = data.status as PaymentStatus;

          this.activeIndex = this.status == PaymentStatus.approved ? 2 : 1;

          if (this.status == PaymentStatus.approved) {
            this.cartService.clean();
          }
        },
        error: (err) => {
          console.error('Error en SSE:', err);
        },
        complete: () => {
          console.log('SSE completado');
        },
      });
  }

  rePay() {
    location.reload();
  }

  calculateRemainingTime() {
    return this.expirationTime.diff(dayjs(), 'second');
  }

  startTimer() {
    this.remainingTime.set(this.calculateRemainingTime());
    const interval = setInterval(() => {
      const remaining = this.remainingTime() - 1;
      this.remainingTime.set(remaining); // Actualiza el tiempo restante

      if (remaining <= 0) {
        clearInterval(interval); // Detiene el temporizador cuando llega a 0
        this.timerExpired = true; // Marca el temporizador como expirado
        this.status = PaymentStatus.rejected;
      }
    }, 1000); // Actualiza cada segundo
  }

  get formattedTime() {
    const seconds = this.remainingTime();
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  ngOnDestroy() {
    if (this.payObservable) {
      this.payObservable.unsubscribe();
    }
  }
}
