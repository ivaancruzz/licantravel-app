import { Component, inject, signal } from '@angular/core';
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
  TuiAlertService,
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
import generateTicketPDF from '../../../helpers/qr-pdf';
import { environment } from '../../../../environments/environment';
import { showErrorMessage } from '../../../helpers/build-error-messages';
import { FormatDatePipe } from '../../../helpers/pipes/format-date.pipe';
import { NgClass } from '@angular/common';

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
    FormatDatePipe,
    NgClass,
  ],
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.scss',
})
export class ViewTicketComponent {
  private readonly alerts = inject(TuiAlertService);

  ticket = signal<TicketList | null>(null);
  ticketStateNames = ticketStateNames;
  TicketState = TicketState;
  flipped = signal<boolean>(true);
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
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
      res.products = res.sales.products.filter(
        (p) => p.id == res.product_id,
      )[0];
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

  async downloadTicket() {
    try {
      const qr = await this.ticketService.generateQR(this.ticket()?.id || '');
      const res = await generateTicketPDF(
        this.ticket()!,
        this.ticket()!.clients,
        qr,
        `${this.NGX_STORAGE_RESOURCES}/logo_pdf.png`,
      );
      console.log(res);
    } catch (e: any) {
      showErrorMessage({
        baseMessage: 'Error al descargar el ticket',
        alert: this.alerts,
        errorApi: e,
      });
    }
  }

  goToProduct() {
    if (
      !this.ticket()!.products.is_visible &&
      !this.ticket()!.products.is_deleted
    )
      return;

    location.href = `categoria/${this.ticket()?.products.categories.slug}/${this.ticket()?.products.slug}`;
  }

  get providerOpenDays() {
    return this.ticket()?.sales.products[0].providers
      ?.open_days as unknown as ProviderOpenDays[];
  }
}
