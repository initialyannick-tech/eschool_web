import {inject, Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  toastr = inject(ToastrService)

  sweetAlertSuccess(msg: string) {
    Swal.fire('Succès', msg, 'success')
  }

  sweetAlertWarning(msg: string) {
    Swal.fire('Attention', msg, 'warning')
  }

  sweetAlertError(msg: string) {
    Swal.fire('Erreur', msg, 'error')
  }

  sweetSuccessInsert() {
    Swal.fire('Succès', "L'insertion effectuée avec succès.", 'success')
  }

  sweetSuccessUpdate() {
    Swal.fire('Succès', "La mise à jour a été effectuée avec succès.", 'success')
  }

  sweetSuccessDelete() {
    Swal.fire('Succès', "La suppression a été effectuée avec succès.", 'success')
  }


  toastSuccess(msg: any) {
    this.toastr.success(msg, 'Félicitations', {
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  toastSuccessInsert() {
    this.toastr.success("L'insertion effectuée avec succès.", 'Félicitations', {
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  toastSuccessUpdate() {
    this.toastr.success("La mise à jour a été effectuée avec succès.", 'Félicitations', {
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  toastSuccessDelete() {
    this.toastr.success("La suppression a été effectuée avec succès.", 'Félicitations', {
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  toastError(msg: any) {
    this.toastr.error(msg, 'Erreur', {
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  toastInfo(msg: any) {
    this.toastr.info(msg, 'Information', {
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  toastWarning(msg: any) {
    this.toastr.warning(msg, 'Attention', {
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

}
