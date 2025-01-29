import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiDialogService, TuiIcon, TuiPopup } from '@taiga-ui/core';
import {
  TuiBadge,
  TuiBadgedContent,
  TuiBadgeNotification,
  TuiCompass,
  TuiDrawer,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-nav',
  imports: [
    TuiButton,
    TuiBadgedContent,
    TuiBadgeNotification,
    TuiDrawer,
    TuiPopup,
    RouterLink,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  protected readonly dialogs = inject(TuiDialogService);
  protected readonly open = signal(false);

  constructor(private router: Router) {}

  public onClose(): void {
    this.open.set(false);
  }

  public toExplore(): void {
    console.log('asd');
    this.router.navigate(['/explorar']);
  }
}
