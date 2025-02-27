import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  inject,
  Input,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TuiButton, TuiDialogContext, TuiIcon } from '@taiga-ui/core';
import {
  TuiPreview,
  TuiPreviewAction,
  TuiPreviewDialogService,
  TuiPreviewPagination,
} from '@taiga-ui/kit';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import Fade from 'embla-carousel-fade';
import {
  PolymorpheusOutlet,
  PolymorpheusTemplate,
} from '@taiga-ui/polymorpheus';
import { TuiSwipeEvent } from '@taiga-ui/cdk/directives/swipe';
import { tuiClamp, TuiSwipe } from '@taiga-ui/cdk';
import { Tables } from '../../lib/database.types';

@Component({
  selector: 'app-shop-images-slider',
  imports: [
    CommonModule,
    EmblaCarouselDirective,
    TuiPreview,
    PolymorpheusOutlet,
    PolymorpheusTemplate,
    TuiPreviewAction,
    TuiSwipe,
    TuiButton,
  ],
  templateUrl: './shop-images-slider.component.html',
  styleUrl: './shop-images-slider.component.scss',
})
export class ShopImagesSliderComponent {
  @Input() images: Tables<'product_multimedia'>[] = [];
  @Input() slider = true;
  @Input() previewImgs = false;
  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;
  @ViewChild('preview')
  protected readonly preview?: TemplateRef<TuiDialogContext>;
  public options = { loop: true, active: this.slider };
  public plugins = [Fade()];
  private emblaApi?: EmblaCarouselType;
  private readonly previewDialogService = inject(TuiPreviewDialogService);
  currentImg = 0;

  constructor() {
    afterNextRender(() => {
      this.emblaApi = this.emblaRef.emblaApi;

      this.images.sort((a, b) => a.order - b.order);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['slider']) {
      this.options = {
        ...this.options,
        active: changes['slider'].currentValue,
      };
    }

    if (changes['previewImgs']) {
      this.previewImgs = changes['previewImgs'].currentValue;
    }
  }

  protected show(img: number): void {
    if (!this.previewImgs) return;

    this.currentImg = img;
    this.previewDialogService
      .open(this.preview || '', { data: img })
      .subscribe();
  }

  protected onSwipe(swipe: TuiSwipeEvent): void {
    if (swipe.direction === 'left') {
      this.currentImg =
        this.currentImg == 0 ? this.images.length - 1 : this.currentImg - 1;
    }

    if (swipe.direction === 'right') {
      this.currentImg =
        this.currentImg >= this.images.length - 1 ? 0 : this.currentImg + 1;
    }
  }
}
