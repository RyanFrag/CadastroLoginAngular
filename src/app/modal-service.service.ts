import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ForgotPasswordModalComponent } from './forgot-password-modal/forgot-password-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef!: BsModalRef;

  constructor(private modalService: BsModalService) {}

  openForgotPasswordModal() {
    this.modalRef = this.modalService.show(ForgotPasswordModalComponent);
  }

  closeForgotPasswordModal() {
    this.modalRef.hide();
  }
}
