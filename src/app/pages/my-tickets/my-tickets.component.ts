import { Component, inject, signal } from '@angular/core';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiGroup,
  TuiIcon,
  TuiLoader,
  TuiSurface,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TicketList,
  TicketService,
  TicketState,
  ticketStateNames,
} from '../../services/ticket.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  TuiBlock,
  TuiRadio,
  TuiTile,
  TuiBadge,
  TuiStatus,
  TuiPagination,
  TuiChip,
} from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { NotFoundItemsComponent } from '../../components/not-found-items/not-found-items.component';
import { FormatDatePipe } from '../../helpers/pipes/format-date.pipe';
import { UserPanelLayoutComponent } from '../../layouts/user-panel-layout/user-panel-layout.component';
import { TicketComponent } from '../../components/ticket/ticket.component';
import { TicketSliderComponent } from '../../components/ticket-slider/ticket-slider.component';
import { showErrorMessage } from '../../helpers/build-error-messages';
import { ProductList } from '../../services/product.service';

@Component({
  selector: 'app-my-tickets',
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
    TicketComponent,
    TicketSliderComponent,
    TuiChip,
    TuiButton,
  ],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss',
})
export class MyTicketsComponent {
  private readonly alerts = inject(TuiAlertService);
  tickets = signal<{ productName: string; tickets: TicketList[] }[]>([]);
  ticketStateNames = ticketStateNames;
  ticketState = TicketState;
  protected readonly filters = [
    {
      label: 'Activos',
      value: TicketState.active,
    },
    {
      label: 'Usuados',
      value: TicketState.used,
    },
    {
      label: 'Cancelados',
      value: TicketState.canceled,
    },
    {
      label: 'Todos',
      value: '',
    },
  ];
  protected readonly formFilter = new FormGroup({
    filter: new FormControl(this.filters[0].value),
  });

  protected breadcrumbs = [
    {
      caption: 'Mis tickets',
    },
  ];

  filterByStatus: TicketState | undefined = TicketState.active;
  filterBySale = '';

  loading = signal(false);
  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    console.log(this.route.snapshot.queryParams['sale']);
    if (this.route.snapshot.queryParams['sale']) {
      this.filterBySale = this.route.snapshot.queryParams['sale'];
    }
    await this.getTickets();
  }

  async getTickets() {
    this.loading.set(true);
    try {
      const { data, count } = await this.ticketService.fetchTickets({
        byStatus: this.filterByStatus,
        bySale: this.filterBySale,
      });

      this.tickets.set(this.groupTicketsByProduct(data));
    } catch (e: any) {
      showErrorMessage({
        baseMessage: 'Error al obtener los tickets',
        alert: this.alerts,
        errorApi: e?.message,
      });
    } finally {
      this.loading.set(false);
    }
  }

  groupTicketsByProduct(
    tickets: TicketList[],
  ): { productName: string; tickets: TicketList[] }[] {
    const grouped = tickets.reduce(
      (acc, ticket) => {
        const product = ticket.sales.products.find(
          (p) => p.id == ticket.product_id,
        ) as ProductList;
        const productId = product.id;

        if (!acc[productId]) {
          acc[productId] = {
            productName: product.name,
            tickets: [],
          };
        }
        acc[productId].tickets.push({ ...ticket, products: product });
        return acc;
      },
      {} as {
        [productId: string]: { productName: string; tickets: TicketList[] };
      },
    );

    return Object.values(grouped);
  }

  removeFilterBySale() {
    this.filterBySale = '';
    this.getTickets();
  }

  handleFilter(filter: string) {
    this.filterByStatus = filter as TicketState | undefined;

    this.getTickets();
  }
}
