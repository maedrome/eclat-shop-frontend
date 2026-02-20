import { Component, input, output } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  template: `
    <div
      class="fixed inset-0 z-[200] flex items-center justify-center animate-fadeIn"
      (click)="cancel.emit()"
      (keydown.escape)="cancel.emit()"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-base-content/30"></div>

      <!-- Dialog -->
      <div
        class="relative bg-base-100 w-full max-w-sm mx-4 shadow-lg animate-fadeIn"
        (click)="$event.stopPropagation()"
      >
        <div class="px-6 pt-6 pb-5">
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-neutral/25 mb-5">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>

          <!-- Title -->
          <p class="text-xs font-montserrat uppercase tracking-widest text-neutral/60 mb-3 select-none">{{ title() }}</p>

          <!-- Message -->
          <p class="text-sm text-neutral/70 font-montserrat leading-relaxed select-none">{{ message() }}</p>

          @if(detail()){
            <div class="mt-4 border border-base-content/15 px-4 py-2.5">
              <p class="text-sm font-montserrat truncate">{{ detail() }}</p>
            </div>
          }
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 flex flex-col gap-1.5">
          <button
            class="w-full text-center text-xs font-montserrat uppercase tracking-widest py-2.5 bg-error text-base-100 hover:bg-error/80 transition-colors duration-300 cursor-pointer select-none"
            (click)="confirm.emit()"
          >
            {{ confirmText() }}
          </button>
          <button
            class="w-full text-center text-xs font-montserrat uppercase tracking-widest py-2 text-neutral/60 hover:text-accent transition-colors duration-200 cursor-pointer select-none"
            (click)="cancel.emit()"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  title = input('Delete product');
  message = input('This action cannot be undone.');
  detail = input('');
  confirmText = input('Delete');

  confirm = output<void>();
  cancel = output<void>();
}
