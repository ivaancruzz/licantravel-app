import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-not-found-items',
  imports: [TuiBlockStatus],
  templateUrl: './not-found-items.component.html',
  styleUrl: './not-found-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundItemsComponent {
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
}
