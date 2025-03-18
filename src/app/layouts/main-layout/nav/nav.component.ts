import {
  afterNextRender,
  Component,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  TuiAlertService,
  TuiBreakpointService,
  TuiButton,
  TuiDialogService,
  TuiExpand,
  TuiHint,
  TuiIcon,
  TuiLink,
  TuiPopup,
} from '@taiga-ui/core';
import {
  TuiBadge,
  TuiBadgedContent,
  TuiBadgeNotification,
  TuiCompass,
  TuiDrawer,
} from '@taiga-ui/kit';
import { Role, UserService } from '../../../services/user.service';
import { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from '../../../services/supabase.service';
import { AsyncPipe, CurrencyPipe, JsonPipe } from '@angular/common';
import { Cart, CartService } from '../../../services/cart.service';
import {
  TuiResponsiveDialog,
  TuiResponsiveDialogOptions,
} from '@taiga-ui/addon-mobile';
import { ItemCartComponent } from '../../../components/item-cart/item-cart.component';
import { error } from 'console';
import { AblePipe, AblePurePipe } from '@casl/angular';
import { TuiAccordion } from '@taiga-ui/experimental';
import { TuiCell } from '@taiga-ui/layout';
import { NotFoundItemsComponent } from '../../../components/not-found-items/not-found-items.component';
import { environment } from '../../../../environments/environment';
import { SearchComponent } from '../../../components/search/search.component';

@Component({
  selector: 'app-nav',
  imports: [
    TuiButton,
    TuiBadgedContent,
    TuiBadgeNotification,
    TuiDrawer,
    TuiPopup,
    RouterLink,
    TuiLink,
    TuiIcon,
    JsonPipe,
    TuiResponsiveDialog,
    ItemCartComponent,
    CurrencyPipe,
    AblePurePipe,
    AsyncPipe,
    TuiAccordion,
    TuiCell,
    TuiHint,
    NotFoundItemsComponent,
    SearchComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  protected readonly breakpoint$ = inject(TuiBreakpointService);
  private readonly injector = inject(Injector);
  protected readonly dialogs = inject(TuiDialogService);
  private readonly alerts = inject(TuiAlertService);
  protected readonly open = signal(false);
  protected readonly options: Partial<TuiResponsiveDialogOptions> = {
    label: 'Carrito de compras',
    size: 's',
  };
  openCart = false;
  cartItems: Cart[] = [];
  Role = Role;
  protected hintShown = false;
  protected panelUrl = environment.PANEL_URL;

  constructor(
    private router: Router,
    public userService: UserService,
    public supabaseService: SupabaseService,
    public cartService: CartService,
  ) {}
  protected toggleHint(): void {
    this.hintShown = !this.hintShown;
  }
  public onClose(): void {
    this.toggleHint();
    this.open.set(false);
  }

  public toExplore(): void {
    this.router.navigate(['/explorar'], {
      queryParams: { page: 1, filter: 'created' },
    });
  }

  public toCheckout() {
    this.openCart = false;
    this.router.navigate(['/carrito']);
  }

  public toRegister(): void {
    this.onClose();
    this.router.navigate(['/registro']);
  }

  public toLogin(): void {
    this.onClose();
    this.router.navigate(['/ingresar']);
  }

  async signOut() {
    this.onClose();
    await this.userService.signOut();
  }

  get userName() {
    return `${this.userService._session()?.user.user_metadata['first_name']} ${this.userService._session()?.user.user_metadata['last_name']}`;
  }

  get displayName() {
    return this.userService._session()?.user.user_metadata['display_name'];
  }

  get inHome() {
    return this.router.url === '/';
  }
}
