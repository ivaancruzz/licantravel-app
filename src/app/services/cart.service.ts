import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProductList, ProductService } from './product.service';
import { SupabaseService } from './supabase.service';
import { Subject } from 'rxjs';
export interface Cart {
  product: ProductList;
  quantity: number;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: WritableSignal<Cart[]> = signal<Cart[]>([]);
  countItems: Signal<number> = computed(() =>
    this.items().reduce((acc, item) => {
      if (item.product.price_off) {
        return acc + item.product.price_off * item.quantity;
      } else {
        return acc + item.product.price * item.quantity;
      }
    }, 0),
  );
  private onRemoveSubject = new Subject<string>();
  onRemove$ = this.onRemoveSubject.asObservable();
  private _cart = new Map<string, Cart>();
  private readonly storageKey = 'cart';

  constructor(
    private supabaseService: SupabaseService,
    private productService: ProductService,
  ) {
    this.init();
  }

  async init() {
    if (this.supabaseService.isServer) return;

    const realProducts = await this.getRealProducts();
    const jsonItems = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    const realItems = jsonItems.filter((item: Cart) => {
      const product = realProducts.find(
        (product: ProductList) => product.id === item.product.id,
      );
      if (product) {
        item.product = product;
      }

      return product || false;
    });

    realItems.forEach((item: Cart) => {
      this._cart.set(item.product.id, item);
    });

    this.items.set(realItems);
  }

  async getRealProducts() {
    const realProducts = await this.productService.fetchProducts();
    return realProducts;
  }

  add(item: Cart) {
    const exist = this._cart.get(item.product.id);

    if (exist) {
      this._cart.set(item.product.id, {
        product: item.product,
        quantity: exist.quantity + 1,
      });
    } else {
      this._cart.set(item.product.id, {
        product: item.product,
        quantity: 1,
      });
    }
    const jsonItems = Array.from(this._cart.values());

    localStorage.setItem(this.storageKey, JSON.stringify(jsonItems));
    this.items.set(jsonItems);
  }
  remove(id: string) {
    this._cart.delete(id);
    const jsonItems = Array.from(this._cart.values());

    localStorage.setItem(this.storageKey, JSON.stringify(jsonItems));
    this.items.set(jsonItems);
    this.onRemoveSubject.next(id);
  }

  decrase(id: string) {
    const exist = this._cart.get(id) as Cart;
    if (exist.quantity <= 1) {
      exist.quantity = 1;
    } else {
      exist.quantity -= 1;
    }

    this._cart.set(id, { ...exist });
    const jsonItems = Array.from(this._cart.values());

    localStorage.setItem(this.storageKey, JSON.stringify(jsonItems));
    this.items.set(jsonItems);
  }

  exist(id: string) {
    return this._cart.has(id);
  }

  clean() {
    this._cart.clear();
    localStorage.removeItem(this.storageKey);
    this.items.set([]);
  }
}
