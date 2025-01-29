import {
  Component,
  inject,
  Inject,
  makeStateKey,
  Optional,
  PLATFORM_ID,
  REQUEST,
  TransferState,
} from '@angular/core';
import { ExploreLayoutComponent } from '../../layouts/explore-layout/explore-layout.component';
import { categories, productsFilter } from '../../fakedata';
import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-explore',
  imports: [CommonModule, ExploreLayoutComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent {
  category = categories[0];
  products = productsFilter;
  isServer = false;
  bindingData: any;
  dataKey = makeStateKey<{ test: any }>('asd');
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Optional() @Inject(REQUEST) request?: Request,
    @Optional() private transferState?: TransferState,
    private httpClient?: HttpClient
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  ngOnInit() {
    if (this.isServer) {
      this.list();
    } else {
      this.bindingData = this.transferState?.get(this.dataKey, {
        test: 'asd',
      });
    }
  }

  list() {
    this.httpClient
      ?.get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe((res) => {
        this.bindingData = this.transferState?.set(this.dataKey, res);
      });
  }
}
