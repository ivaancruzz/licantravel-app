import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBlockStatus } from '@taiga-ui/layout';

@Component({
  selector: 'app-not-found-items',
  imports: [TuiBlockStatus],
  templateUrl: './not-found-items.component.html',
  styleUrl: './not-found-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundItemsComponent {}
