import {
  Component,
  effect,
  inject,
  input,
  Input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  TicketList,
  TicketService,
  ticketStateNames,
} from '../../services/ticket.service';
import {
  TuiBadge,
  TuiPreview,
  TuiPreviewAction,
  TuiPreviewDialogService,
} from '@taiga-ui/kit';
import { Route, Router, RouterLink } from '@angular/router';
import {
  TuiAlertService,
  TuiButton,
  TuiDialogContext,
  TuiIconPipe,
} from '@taiga-ui/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-ticket',
  imports: [
    NgClass,
    TuiBadge,
    RouterLink,
    TuiButton,
    TuiPreview,
    TuiPreviewAction,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
  animations: [
    trigger('flip', [
      state('false', style({ transform: 'none' })),
      state('true', style({ transform: 'rotateX(180deg)' })),
      transition('false <=> true', animate('0.8s ease-in-out')),
    ]),
  ],
})
export class TicketComponent {
  private readonly alerts = inject(TuiAlertService);
  private readonly previewDialogService = inject(TuiPreviewDialogService);

  @ViewChild('preview')
  protected readonly preview?: TemplateRef<TuiDialogContext>;

  @Input() goToPage: boolean = true;
  flipped = input<boolean>(true);
  @Input({ required: true }) ticket!: TicketList;

  ticketStatusNames = ticketStateNames;
  qr = '';
  viewQr = false;

  constructor(private ticketService: TicketService) {}

  async ngOnInit() {
    if (this.goToPage) return;

    try {
      this.qr = await this.ticketService.generateQR(this.ticket.id);
    } catch (e) {
      console.error(e);
      this.alerts
        .open('Error al generar código QR', {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  protected show(): void {
    this.previewDialogService.open(this.preview || '').subscribe();
  }
}
