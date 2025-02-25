import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserPanelLayoutComponent } from '../../layouts/user-panel-layout/user-panel-layout.component';
import {
  TuiAppearance,
  TuiGroup,
  TuiIcon,
  TuiSurface,
  TuiTextfield,
} from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TuiBadge,
  TuiBlock,
  TuiFade,
  TuiRadio,
  TuiStatus,
  TuiTile,
} from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [
    CurrencyPipe,
    UserPanelLayoutComponent,
    TuiTextfield,
    ReactiveFormsModule,
    TuiBlock,
    TuiGroup,
    TuiRadio,
    TuiCardMedium,
    TuiTile,
    TuiAppearance,
    TuiBadge,
    TuiStatus,
    TuiIcon,
    TuiSurface,
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyOrdersComponent {
  protected readonly testForm = new FormGroup({
    testValue: new FormControl('orange'),
  });
}
