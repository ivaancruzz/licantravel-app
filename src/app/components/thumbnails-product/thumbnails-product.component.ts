import {
  afterNextRender,
  Component,
  inject,
  input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import { Tables } from '../../lib/database.types';
import {
  addThumbBtnsClickHandlers,
  addToggleThumbBtnsActive,
} from './emblaThumbnails';
import { TuiSwipe, TuiSwipeEvent } from '@taiga-ui/cdk';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import {
  TuiPreview,
  TuiPreviewAction,
  TuiPreviewDialogService,
  TuiPreviewPagination,
} from '@taiga-ui/kit';
import {
  PolymorpheusOutlet,
  PolymorpheusTemplate,
} from '@taiga-ui/polymorpheus';
import { ProductMultimedia } from '../../services/product.service';

@Component({
  selector: 'app-thumbnails-product',
  imports: [
    EmblaCarouselDirective,
    TuiPreview,
    TuiPreviewPagination,
    PolymorpheusOutlet,
    PolymorpheusTemplate,
    TuiPreviewAction,
    TuiSwipe,
    TuiButton,
  ],
  templateUrl: './thumbnails-product.component.html',
  styleUrl: './thumbnails-product.component.scss',
})
export class ThumbnailsProductComponent {
  images = input.required<ProductMultimedia[]>();
  @ViewChildren(EmblaCarouselDirective)
  viewport!: QueryList<EmblaCarouselDirective>;
  @ViewChild('preview')
  protected readonly preview?: TemplateRef<TuiDialogContext>;
  private readonly previewDialogService = inject(TuiPreviewDialogService);
  public optionsMain = { loop: true };
  public optionsThumbs = { containScroll: 'keepSnaps', dragFree: true };
  currentImg = 0;

  constructor() {
    afterNextRender(() => {
      this.images().sort((a, b) => a.order - b.order);

      addThumbBtnsClickHandlers(
        this.viewport.first.emblaApi!,
        this.viewport.last.emblaApi!,
      );
      addToggleThumbBtnsActive(
        this.viewport.first.emblaApi!,
        this.viewport.last.emblaApi!,
      );
    });
  }

  protected show(index: number): void {
    this.currentImg = index;
    this.previewDialogService.open(this.preview || '').subscribe();
  }

  protected onSwipe(swipe: TuiSwipeEvent): void {
    if (swipe.direction === 'left') {
      this.currentImg =
        this.currentImg == 0 ? this.images().length - 1 : this.currentImg - 1;
    }

    if (swipe.direction === 'right') {
      this.currentImg =
        this.currentImg >= this.images().length - 1 ? 0 : this.currentImg + 1;
    }
  }
}
