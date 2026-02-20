import { Injectable, signal } from '@angular/core';

export interface AdminToast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class AdminToastService {
  toast = signal<AdminToast | null>(null);
  private timeout: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: AdminToast['type'] = 'success', duration = 3000) {
    if (this.timeout) clearTimeout(this.timeout);
    this.toast.set({ message, type });
    this.timeout = setTimeout(() => this.toast.set(null), duration);
  }
}
