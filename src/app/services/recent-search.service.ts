import { Injectable, signal } from '@angular/core';
import { ProductList } from './product.service';

export interface RecentSearch extends ProductList {
  recent?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RecentSearchService {
  items = signal<RecentSearch[]>([]);
  private readonly map = new Map<string, RecentSearch>();
  private readonly storageKey = 'recentProducts';

  constructor() {
    const jsonItems = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    jsonItems.forEach((item: RecentSearch) => {
      this.map.set(item.id, item);
    });

    this.items.set(jsonItems);
  }

  add(item: RecentSearch): void {
    this.map.set(item.id, item);
    const jsonItems = Array.from(this.map.values());

    localStorage.setItem(this.storageKey, JSON.stringify(jsonItems));
    this.items.set(jsonItems);
  }

  remove(id: string) {
    this.map.delete(id);
    const jsonItems = Array.from(this.map.values());

    localStorage.setItem(this.storageKey, JSON.stringify(jsonItems));
    this.items.set(jsonItems);
  }
}
