import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiIcon,
  TuiNotification,
} from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiInputModule } from '@taiga-ui/legacy';
import {
  TicketList,
  TicketService,
  TicketState,
  ticketStateNames,
} from '../../services/ticket.service';
import { FormsModule } from '@angular/forms';
import {
  TuiResponsiveDialog,
  TuiResponsiveDialogOptions,
} from '@taiga-ui/addon-mobile';
import dayjs from 'dayjs';
import { ProviderOpenDays } from '../../services/provider.service';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-scan',
  imports: [
    TuiIcon,
    TuiCardLarge,
    TuiAppearance,
    TuiButton,
    TuiResponsiveDialog,
    TuiInputModule,
    FormsModule,
    TuiNotification,
  ],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss',
})
export class ScanComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  private readonly alerts = inject(TuiAlertService);
  qrScanner: QrScanner | null = null;

  openScan = signal(false);
  validateCode = false;
  code = '';
  id = '';
  ticket: TicketList | null = null;
  ticketStateNames = ticketStateNames;
  TicketState = TicketState;
  protected readonly options: Partial<TuiResponsiveDialogOptions> = {
    label: 'Ticket  de entrada',
    size: 's',
  };

  constructor(private ticketService: TicketService) {}

  async openCamera() {
    try {
      const cameras = await QrScanner.listCameras(true);

      this.openScan.set(true);

      setTimeout(() => {
        this.qrScanner = new QrScanner(
          this.videoElement.nativeElement,
          (result) => {
            if (this.id) return;
            this.id = result.data;
            this.getTicket();
          },
          {
            highlightScanRegion: true,
          },
        );
        this.qrScanner.start();
      }, 500);
      // await this.qrScanner?.setCamera(facingModeOrDeviceId);
    } catch (error) {
      this.alerts
        .open('No diste permiso para acceder a la cámara.', {
          label: 'Error',
          appearance: 'negative',
          autoClose: 0,
        })
        .subscribe();
    }
  }

  closeCamera() {
    this.qrScanner?.destroy();
    this.qrScanner = null;
    this.openScan.set(false);
    this.id = '';
  }

  async getTicket() {
    try {
      this.ticket = await this.ticketService.getTicket({
        code: this.code,
        id: this.id,
      });
    } catch (e: any) {
      console.error(e);
      this.closeCamera();
      this.id = '';
      this.alerts
        .open('Este ticket no existe o pertenece a otro proveedor.', {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  async validate() {
    try {
      await this.ticketService.validateTicket(this.ticket!.id);
      this.ticket = null;
      this.validateCode = false;
      this.alerts
        .open('Ticket validado', {
          label: 'Éxito',
          appearance: 'positive',
          autoClose: 10000,
        })
        .subscribe();
    } catch (e) {
      this.alerts
        .open('Error al validar el ticket.', {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  getDayName(dayNumber: number): string {
    return dayjs().day(dayNumber).format('dddd');
  }

  get providerOpenDays() {
    return this.ticket?.product.provider
      ?.open_days as unknown as ProviderOpenDays[];
  }
}
