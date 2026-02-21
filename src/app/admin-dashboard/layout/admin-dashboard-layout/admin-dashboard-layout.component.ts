import { AdminNavbarComponent } from '@admin-dashboard/components/admin-navbar/admin-navbar.component';
import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AdminToastService } from '@admin-dashboard/services/admin-toast.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AdminNavbarComponent],
  templateUrl: './admin-dashboard-layout.component.html',
  styles: ``
})
export class AdminDashboardLayoutComponent {
  authService = inject(AuthService);
  toastService = inject(AdminToastService);
  user = computed(() => this.authService.user());

  private drawerToggle = viewChild<ElementRef<HTMLInputElement>>('drawerToggle');

  closeDrawer() {
    const el = this.drawerToggle()?.nativeElement;
    if (el) el.checked = false;
  }
}
