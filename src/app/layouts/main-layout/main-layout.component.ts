import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-main-layout',
  imports: [NavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
