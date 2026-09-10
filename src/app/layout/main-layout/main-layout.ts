import {Component, HostListener, Inject, inject, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {ApiService} from '../../core/services/api.service';
import {CookieService} from '../../core/services/cookie.service';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import Swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UpdatePasswordComponent} from '../../features/admin/components/update-password/update-password.component';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {NgxPermissionsModule} from 'ngx-permissions';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgxPermissionsModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  authService = inject(AuthService)
  apiService = inject(ApiService)
  cookieService = inject(CookieService)
  route = inject(Router)
  modal = inject(NgbModal)

  userConnected: any
  passwordChanged: any
  permissionItems: any[] = []

  isSidebarOpen = true;
  isMobile = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  @HostListener('window:resize')
  checkScreen() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.isMobile = window.innerWidth < 992;

    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }


  ngOnInit() {
    this.checkScreen();
    this.userConnected = this.authService.getUser();
    if (this.userConnected) {
      this.permissionItems = this.authService.getPermissions();
      this.apiService.loadPermissions(this.permissionItems)
    }

    this.passwordChanged = this.authService.passwordChanged()
    if (this.passwordChanged === 'inactive') {
      Swal.fire({
        title: 'Mot de passe',
        text: 'Vous devez changer votre mot de passe',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Plus tard',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.changePassword()
        }
      });
    }
  }


  logout() {
    Swal.fire(
      {
        title: 'Déconnexion',
        text: 'Voulez-vous vraiment vous déconnecter ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }
    ).then((result) => {
      if (result.isConfirmed) {
        this.logoutUser()
      }
    })

  }


  changePassword() {
    const modal = this.modal.open(UpdatePasswordComponent, {size: 'md', backdrop: 'static'})
    modal.componentInstance.user = this.userConnected
  }

  logoutUser() {
    this.apiService.post('auth/logout', {}).then((data: any) => {
      this.cookieService.deleteCookie('token')
      this.cookieService.deleteCookie('userConnected')
      this.cookieService.deleteCookie('permissions')
      this.route.navigate(['/login'])
    })
  }
}
