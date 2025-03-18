import { Injectable } from '@angular/core';
import { TuiPopoverService } from '@taiga-ui/cdk';
import { TUI_DIALOGS } from '@taiga-ui/core';

import { ModalScanComponent } from './modal-scan.component';

@Injectable({
  providedIn: 'root',
  useFactory: () => new ModalScanService(TUI_DIALOGS, ModalScanComponent),
})
export class ModalScanService extends TuiPopoverService<boolean> {}
