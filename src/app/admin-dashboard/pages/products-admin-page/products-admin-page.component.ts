import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { ProductsTableComponent } from "../../../products/components/products-table/products-table.component";
import { SortEvent } from "../../../products/components/products-table/products-table.component";
import { ProductsService } from '@products/services/products.service';
import { rxResource} from '@angular/core/rxjs-interop';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Product } from '@products/interfaces/product.interface';
import { AdminToastService } from '@admin-dashboard/services/admin-toast.service';
import { ConfirmDialogComponent } from '@admin-dashboard/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent, RouterLink, ConfirmDialogComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  paginationService = inject(PaginationService);
  toastService = inject(AdminToastService);
  router = inject(Router);
  productsPerPage = linkedSignal(this.paginationService.showPerPage);

  sortBy = signal<string>('');
  sortDirection = signal<'ASC' | 'DESC'>('ASC');

  productToDelete = signal<Product | null>(null);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.pageQueryParam(),
      limit: this.productsPerPage(),
      sortBy: this.sortBy(),
      sortOrder: this.sortDirection()
    }),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: request.page-1,
        limit: request.limit,
        sortBy: request.sortBy,
        sortOrder: request.sortOrder
      })
    }
  })
  onLimitChange = (value: number) => {
    this.paginationService.showPerPage.set(value)
    this.router.navigate(['/admin/products'],{
      queryParams: {
        page: 1
      }
    })
  }

  keepPagesNumber = effect(() => {
    if (this.productsResource.hasValue()){
      this.paginationService.pages.set(this.productsResource.value().pages);
    }
  })

  onSort(event: SortEvent) {
    this.sortBy.set(event.column);
    this.sortDirection.set(event.direction);
  }

  onDeleteProduct = (product: Product) => {
    this.productToDelete.set(product);
  }

  onConfirmDelete = () => {
    const product = this.productToDelete();
    if (!product) return;
    this.productToDelete.set(null);
    this.productsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.toastService.show('Product deleted successfully');
        this.productsResource.reload();
      },
      error: () => {
        this.toastService.show('Failed to delete product', 'error');
      }
    });
  }
}
