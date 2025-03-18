import { Component, inject, Input, ViewChild } from '@angular/core';
import {
  EmblaCarouselDirective,
  EmblaOptionsType,
} from 'embla-carousel-angular';
import { TicketList } from '../../services/ticket.service';
import { TicketComponent } from '../ticket/ticket.component';
import { TuiBreakpointService } from '@taiga-ui/core';

@Component({
  selector: 'app-ticket-slider',
  imports: [EmblaCarouselDirective, TicketComponent],
  templateUrl: './ticket-slider.component.html',
  styleUrl: './ticket-slider.component.scss',
})
export class TicketSliderComponent {
  protected readonly breakpoint$ = inject(TuiBreakpointService);
  @Input({ required: true }) tickets: TicketList[] = [];
  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;
  public options: EmblaOptionsType = { containScroll: false };

  ngOnInit() {
    this.breakpoint$.subscribe((breakpoint) => {
      if (breakpoint !== 'mobile') {
        this.options = { dragFree: true, align: 'start' };
      }
    });
  }
}
