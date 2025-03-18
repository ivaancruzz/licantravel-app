import { Component, signal } from '@angular/core';
import { UserPanelLayoutComponent } from '../../../layouts/user-panel-layout/user-panel-layout.component';
import { ActivatedRoute } from '@angular/router';
import {
  paymentMethodNames,
  paymentStatusNames,
  SaleList,
  SaleService,
} from '../../../services/sale.service';
import { NotFoundItemsComponent } from '../../../components/not-found-items/not-found-items.component';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiAppearance, TuiButton, TuiLoader } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { FormatDatePipe } from '../../../helpers/pipes/format-date.pipe';
import { ProductList } from '../../../services/product.service';
import { Tables } from '../../../lib/database.types';
import { CheckoutResumeItemComponent } from '../../../components/checkout-resume-item/checkout-resume-item.component';
import { Cart } from '../../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-order',
  imports: [
    UserPanelLayoutComponent,
    NotFoundItemsComponent,
    TuiCardLarge,
    TuiAppearance,
    TuiHeader,
    TuiBadge,
    FormatDatePipe,
    CheckoutResumeItemComponent,
    CurrencyPipe,
    TuiButton,
    TuiLoader,
  ],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss',
})
export class ViewOrderComponent {
  order = signal<SaleList | null>(null);
  paymentStatusNames = paymentStatusNames;
  paymentMethodNames = paymentMethodNames;
  protected breadcrumbs = [
    {
      caption: 'Mis compras',
      routerLink: '/mis-compras',
    },
    {
      caption: '#000',
    },
  ];

  code: string | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.code = params.get('code');

      this.breadcrumbs[1] = {
        caption: `#${this.code}`,
      };

      await this.getOrder();
    });
  }

  async getOrder() {
    this.loading = true;
    try {
      const res = await this.saleService.getOrder(this.code!);
      this.order.set(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  screenShotProducts() {
    return this.order()!.products as unknown as (ProductList & {
      quantity: number;
    })[];
  }

  productItem(item: ProductList & { quantity: number }) {
    return {
      product: item,
      quantity: item.quantity,
    } as Cart;
  }
}
