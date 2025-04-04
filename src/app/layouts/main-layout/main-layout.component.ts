import { afterRender, Component } from '@angular/core';
import { TuiButton, TuiScrollbar } from '@taiga-ui/core';
import { NavComponent } from './nav/nav.component';
import {
  TuiResponsiveDialog,
  TuiResponsiveDialogOptions,
} from '@taiga-ui/addon-mobile';
import { ItemCartComponent } from '../../components/item-cart/item-cart.component';
import { AsyncPipe } from '@angular/common';
import { Role } from '../../services/user.service';
import { NgxPermissionsDirective, NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-main-layout',
  imports: [NavComponent, AsyncPipe, NgxPermissionsModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  Role = Role;
}
