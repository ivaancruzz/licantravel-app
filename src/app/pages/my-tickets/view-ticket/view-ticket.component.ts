import { Component, signal } from '@angular/core';
import {
  TicketList,
  TicketService,
  TicketState,
  ticketStateNames,
} from '../../../services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { UserPanelLayoutComponent } from '../../../layouts/user-panel-layout/user-panel-layout.component';
import { NotFoundItemsComponent } from '../../../components/not-found-items/not-found-items.component';
import { TuiBadge, TuiTile } from '@taiga-ui/kit';
import {
  TuiAppearance,
  TuiButton,
  TuiLink,
  TuiLoader,
  TuiNotification,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TicketComponent } from '../../../components/ticket/ticket.component';
import dayjs from 'dayjs';
import { ProviderOpenDays } from '../../../services/provider.service';

@Component({
  selector: 'app-view-ticket',
  imports: [
    UserPanelLayoutComponent,
    NotFoundItemsComponent,
    TuiNotification,
    TuiLoader,
    TuiCardLarge,
    TuiAppearance,
    TuiHeader,
    TuiTile,
    TuiButton,
    TicketComponent,
    TuiLink,
  ],
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.scss',
})
export class ViewTicketComponent {
  ticket = signal<TicketList | null>(null);
  ticketStateNames = ticketStateNames;
  TicketState = TicketState;
  flipped = signal<boolean>(true);
  protected breadcrumbs = [
    {
      caption: 'Mis Tickets',
      routerLink: '/mis-tickets',
    },
    {
      caption: '#000',
    },
  ];

  code: string | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.code = params.get('code');

      this.breadcrumbs[1] = {
        caption: `#${this.code}`,
      };

      await this.getTicket();
    });
  }

  async getTicket() {
    this.loading = true;
    try {
      const res = await this.ticketService.getTicket({
        code: this.code!,
      });
      this.ticket.set(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  getDayName(dayNumber: number): string {
    return dayjs().day(dayNumber).format('dddd');
  }

  get providerOpenDays() {
    return this.ticket()?.product.provider
      ?.open_days as unknown as ProviderOpenDays[];
  }
}
