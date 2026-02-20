import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

export interface SortEvent {
  column: 'price' | 'stock';
  direction: 'ASC' | 'DESC';
}

@Component({
  selector: 'products-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  products = input.required<Product[]>();
  productRoute = input.required();
  showDelete = input(false);
  isLoading = input(false);
  skeletonRows = input(10);
  delete = output<Product>();

  sortColumn = input<string>('');
  sortDirection = input<'ASC' | 'DESC'>('ASC');
  sort = output<SortEvent>();

  toggleSort(column: 'price' | 'stock') {
    if (this.sortColumn() === column) {
      this.sort.emit({ column, direction: this.sortDirection() === 'ASC' ? 'DESC' : 'ASC' });
    } else {
      this.sort.emit({ column, direction: 'ASC' });
    }
  }
}
