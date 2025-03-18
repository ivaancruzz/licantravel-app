import { Component, inject, signal } from '@angular/core';
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
import { RouterLink } from '@angular/router';
import {
  TuiBlock,
  TuiRadio,
  TuiTile,
  TuiBadge,
  TuiStatus,
  TuiPagination,
} from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { NotFoundItemsComponent } from '../../components/not-found-items/not-found-items.component';
import { FormatDatePipe } from '../../helpers/pipes/format-date.pipe';
import { UserPanelLayoutComponent } from '../../layouts/user-panel-layout/user-panel-layout.component';
import { TicketComponent } from '../../components/ticket/ticket.component';
import { TicketSliderComponent } from '../../components/ticket-slider/ticket-slider.component';

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
  ],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss',
})
export class MyTicketsComponent {
  private readonly alerts = inject(TuiAlertService);
  activeTickets = signal<{ productName: string; tickets: TicketList[] }[]>([]);
  tickets = signal<TicketList[]>([]);
  ticketStateNames = ticketStateNames;
  ticketState = TicketState;
  currentPage = 0;
  pages = 0;
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
      value: TicketState.expired,
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

  filter: TicketState | undefined = TicketState.active;

  loading = signal(false);
  constructor(private ticketService: TicketService) {}

  async ngOnInit() {
    await this.getActiveTickets();

    const res = await this.ticketService.generateQR("prueba")
    console.log(res)
  }

  async getTickets() {
    this.loading.set(true);
    try {
      const { data, count } = await this.ticketService.fetchTickets({
        page: this.currentPage,
        filter: this.filter,
      });
      this.tickets.set(data);
      this.pages = Math.ceil(count / this.ticketService.pageLimit);
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al obtener los tickets' + e?.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    } finally {
      this.loading.set(false);
    }
  }

  async getActiveTickets() {
    this.loading.set(true);
    try {
      const res = await this.ticketService.fetchActiveTickets();
      this.activeTickets.set(this.groupTicketsByProduct(res));
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al obtener los tickets activos' + e?.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    } finally {
      this.loading.set(false);
    }
  }

  groupTicketsByProduct(
    tickets: TicketList[],
  ): { productName: string; tickets: TicketList[] }[] {
    const grouped = tickets.reduce(
      (acc, ticket) => {
        const productId = ticket.product.id;
        if (!acc[productId]) {
          acc[productId] = {
            productName: ticket.product.name,
            tickets: [],
          };
        }
        acc[productId].tickets.push(ticket);
        return acc;
      },
      {} as {
        [productId: string]: { productName: string; tickets: TicketList[] };
      },
    );

    return Object.values(grouped);
  }

  handleFilter(filter: string) {
    this.currentPage = 0;
    this.filter = filter as TicketState | undefined;

    if (filter === TicketState.active) {
      this.getActiveTickets();
    } else {
      this.getTickets();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getTickets();
  }
}
