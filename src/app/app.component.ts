import { RouterLink, RouterOutlet } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  Optional,
  REQUEST_CONTEXT,
} from '@angular/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService, TuiButton, TuiRoot } from '@taiga-ui/core';
import { TUI_CONFIRM, type TuiConfirmData } from '@taiga-ui/kit';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayoutComponent, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private supabaseService: SupabaseService) {
    // console.log(context);
    // this.supabaseService.setClient(context.supabase)
  }
}
