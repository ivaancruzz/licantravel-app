import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';

@Component({
  selector: 'app-user-panel-layout',
  imports: [RouterLink, TuiBreadcrumbs, TuiItem, TuiLink],
  templateUrl: './user-panel-layout.component.html',
  styleUrl: './user-panel-layout.component.scss',
})
export class UserPanelLayoutComponent {
  protected items = [
    {
      caption: 'Selects',
      routerLink: '/components/select',
    },
    {
      caption: 'Multi',
      routerLink: '/components/multi-select',
    },
    {
      caption: 'With tags',
      routerLink: '/components/multi-select',
    },
    {
      caption: 'Current',
      routerLink: '/navigation/breadcrumbs',
      routerLinkActiveOptions: { exact: true },
    },
  ];
}
