import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent { 
  pages = input(5)
  currentPage = input(1);
  // activePage = linkedSignal(this.currentPage)
  // pagesList = computed(()=> {return Array.from({length: this.pages()}, (_,i)=>i+1)})
  
  total = linkedSignal(this.pages);
  current = linkedSignal(this.currentPage);
  // Calcula las páginas visibles (máximo 3)
  visiblePages = computed(() => {
    const visible: number[] = [];
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    
    if (this.total() <= 7) {
      // Si hay 7 o menos páginas, mostrarlas todas
      return Array.from({length: this.total()}, (_, i) => i + 1);
    }
    pages.push(1);
    
    // Lógica para mostrar máximo 3 páginas
  //   if (this.current() === 1) {
  //     visible.push(1, 2, 3);
  //   } else if (this.current() >= this.total()) {
  //     visible.push(this.total() - 2, this.total() - 1, this.total());
  //   } else {
  //     visible.push(this.current() - 1, this.current(), 1 + this.current());
  //   }
    
  //   return visible;
  // });
    let startPage: number;
    let endPage: number;
    
    if (this.current() <= 3) {
      // Cerca del inicio: 1 2 3 4 5 ... 10
      startPage = 2;
      endPage = 5;
    } else if (this.current() >= this.total() - 2) {
      // Cerca del final: 1 ... 6 7 8 9 10
      startPage = this.total() - 4;
      endPage = this.total() - 1;
    } else {
      // En el medio: 1 ... 4 5 6 ... 10
      startPage = this.current() - 1;
      endPage = this.current() + 1;
    }
    
    // Agregar ellipsis inicial si es necesario
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    // Agregar páginas del rango
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < this.total()) {
        pages.push(i);
      }
    }
    
    // Agregar ellipsis final si es necesario
    if (endPage < this.total() - 1) {
      pages.push('ellipsis-end');
    }
    
    // Siempre mostrar la última página (si hay más de 1)
    if (this.total() > 1) {
      pages.push(this.total());
    }
    
    return pages;
  });
  
  // Verifica si mostrar el botón de última página
  // showLastPage = computed(() => {
  //   const visible = this.visiblePages();
  //   const total = this.pages();
  //   return total > 3 && !visible.includes(total) && this.current()+2 !== total;
  // });
  
  // Verifica si hay página anterior
  hasPrevious = computed(() => this.currentPage() > 1);
  
  // Verifica si hay página siguiente
  hasNext = computed(() => this.currentPage() < this.pages());
  
  // Obtiene el número de la página anterior
  previousPageNumber = computed(() => Math.max(1, this.currentPage() - 1));
  
  // Obtiene el número de la página siguiente
  nextPageNumber = computed(() => Math.min(this.pages(), this.currentPage()+ 1));

  isNumber(item: number | string): item is number {
    return typeof item === 'number';
  }

}
