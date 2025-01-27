import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiHint, TuiSurface, TuiTextfield } from '@taiga-ui/core';
import { TuiCardLarge, TuiCell, TuiHeader } from '@taiga-ui/layout';
import { categories } from '../../fakedata';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [TuiTextfield, TuiSurface, TuiCardLarge, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  categories = categories;
}
