import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  imports: [NgClass],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent {
  show = input.required();
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
}
