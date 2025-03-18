import { Component } from '@angular/core';
import { TuiPopover } from '@taiga-ui/cdk';
import { TuiAlertOptions, TuiButton } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-alert-confirm-email',
  imports: [TuiButton],
  templateUrl: './alert-confirm-email.component.html',
  styleUrl: './alert-confirm-email.component.scss',
})
export class AlertConfirmEmailComponent {
  protected readonly context =
    injectContext<TuiPopover<TuiAlertOptions<void>, boolean>>();
}
