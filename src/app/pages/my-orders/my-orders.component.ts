import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { UserPanelLayoutComponent } from '../../layouts/user-panel-layout/user-panel-layout.component';
import {
  TuiAlertService,
  TuiAppearance,
  TuiGroup,
  TuiIcon,
  TuiLoader,
  TuiSurface,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiBadge,
  TuiBlock,
  TuiFade,
  TuiPagination,
  TuiRadio,
  TuiStatus,
  TuiTile,
} from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { CurrencyPipe } from '@angular/common';
import {
  PaymentStatus,
  paymentStatusNames,
  SaleList,
  SaleService,
} from '../../services/sale.service';
import { FormatDatePipe } from '../../helpers/pipes/format-date.pipe';
import { RouterLink } from '@angular/router';
import { NotFoundItemsComponent } from '../../components/not-found-items/not-found-items.component';
import { showErrorMessage } from '../../helpers/build-error-messages';

@Component({
  selector: 'app-my-orders',
  imports: [
    CurrencyPipe,
    UserPanelLayoutComponent,
    TuiTextfield,
    ReactiveFormsModule,
    TuiBlock,
    TuiGroup,
    TuiRadio,
    TuiCardMedium,
    TuiTile,
    TuiAppearance,
    TuiBadge,
    TuiStatus,
    TuiIcon,
    TuiSurface,
    FormsModule,
    FormatDatePipe,
    TuiPagination,
    RouterLink,
    NotFoundItemsComponent,
    TuiLoader,
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyOrdersComponent {
  private readonly alerts = inject(TuiAlertService);
  orders = signal<SaleList[]>([]);
  paymentStatusNames = paymentStatusNames;
  currentPage = 0;
  pages = 0;
  protected readonly filters = [
    {
      label: 'Todos',
      value: '',
    },

    {
      label: 'Aprobados',
      value: PaymentStatus.approved,
    },
    {
      label: 'Pendientes',
      value: PaymentStatus.pending,
    },
    {
      label: 'Rechazados',
      value: PaymentStatus.rejected,
    },
  ];
  protected readonly formFilter = new FormGroup({
    filter: new FormControl(this.filters[0].value),
  });

  protected breadcrumbs = [
    {
      caption: 'Mis compras',
    },
  ];

  filter: PaymentStatus | undefined = undefined;
  loading = signal(false);
  constructor(private saleService: SaleService) {}

  async ngOnInit() {
    await this.getOrders();
  }

  async getOrders() {
    this.loading.set(true);
    try {
      const { data, count } = await this.saleService.fetchSales({
        page: this.currentPage,
        filter: this.filter,
      });
      this.orders.set(data);
      this.pages = Math.ceil(count / this.saleService.pageLimit);
    } catch (e: any) {
      showErrorMessage({
        baseMessage: 'Error al obtener las compras',
        alert: this.alerts,
        errorApi: e?.message,
      });
    } finally {
      this.loading.set(false);
    }
  }

  handleFilter(filter: string) {
    this.currentPage = 0;
    this.filter = filter as PaymentStatus | undefined;
    this.getOrders();
  }

  countTickets(sale: SaleList) {
    const count = sale.sales_products.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    return `x${count} ${count > 1 ? 'Tickets' : 'Ticket'}`;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getOrders();
  }
}
