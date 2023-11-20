import { Component } from '@angular/core';
import { ModalService } from '../modal-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password-modal',
  template: `
  
  <div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title">Lembrar Senha</h5>
  </div>
  <form (ngSubmit)="onSubmit()" [formGroup]="form">
    <div class="modal-body">
      <div class="row">
        <div class="form-group col-md-4">
          <label>CPF<span class="obrigatorio">*</span></label>
          <input mask="000.000.000-00"  maxlength="14" type="text" name="cpfUsuario" (input)="formatCpf()"   formControlName="cpf" ngModel  [ngClass]="{'is-invalid': errorCpf}" required placeholder="___.___.___-__" class="form-control" />
          <small  *ngIf="errorCpf" class="text-danger">CPF obrigatório</small>
        </div>
        <div class="form-group col-md-6">
          <label>Data de nascimento<span class="obrigatorio">*</span></label>
          <div class="form-inline custom-datepicker-dropdown">
            <div class="form-group mb-0" style="width: 100%;">
              <div class="input-group" style="width: 100%;">
                <input type="date"name="dataNascimento" maxlength="10" required autocomplete="off"  formControlName="date" bsdatepicker placeholder="__/__/____" class="form-control inputData" [ngClass]="{'is-invalid': errorDate}" style="height: 38px; max-width: 150px !important;" maxlength="10" />
              </div>
            </div>
          </div>
          <small  *ngIf="errorDate" class="text-danger">Data de nascimento obrigatória</small>
        </div>
        <div class="form-group col-12">
          <label>E-mail utilizado no cadastro<span class="obrigatorio">*</span></label>
          <input type="text" name="email" required ngModel placeholder="Insira E-mail aqui" formControlName="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$"  (focusout)="error()"  [ngClass]="{'is-invalid': errorEmail}" class="form-control" />
          <small *ngIf="errorEmail" class="text-danger">Email obrigatório</small>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-success">Recuperar <i class="fa fa-check"></i></button>
      <button class="btn btn-warning" (click)="close()">Fechar <i class="fa fa-times"></i></button>
    </div>
  </form>
</div>
  `,
})
export class ForgotPasswordModalComponent {
  form!: FormGroup;
  cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  errorEmail : boolean = false;
  errorCpf : boolean = false;
  errorDate : boolean = false;

  ngOnInit(): void {
    this.form = new FormGroup({
      cpf: new FormControl('', [Validators.required, Validators.pattern(this.cpfPattern)]),
      date: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  get cpf() { return this.form.get('cpf'); }
  get date() { return this.form.get('date'); }
  get email() { return this.form.get('email'); }
  
  constructor(private modalService: ModalService, private http: HttpClient) {}

  close() {
    this.modalService.closeForgotPasswordModal();
  }


  formatCpf() {
    const cpfControl = this.form.get('cpf');
    if (cpfControl?.value) {
      let value = cpfControl.value.replace(/\D/g, ''); 
      if (value.length <= 3) {
        cpfControl.setValue(value);
      } else if (value.length <= 6) {
        cpfControl.setValue(`${value.slice(0, 3)}.${value.slice(3)}`);
      } else if (value.length <= 9) {
        cpfControl.setValue(`${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`);
      } else {
        cpfControl.setValue(`${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`);
      }
    }
  }

  formatDate(inputDate: string): string {
    const parts = inputDate.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
  
    return `${day}/${month}/${year}`;
  }
  
  onSubmit() {
    const email = this.email?.value;
    const date = this.formatDate(this.date?.value);
    const cpf = this.cpf?.value;
  
    console.log(email, date, cpf);
    this.errorEmail = !email; 
    this.errorDate = !date; 
    this.errorCpf = !cpf;
  
    if (!this.errorEmail && !this.errorDate && !this.errorCpf) {
      const url = `http://localhost:8080/users/check?cpf=${cpf}&dataNascimento=${date}&email=${email}`;
      
      let resultadoDaRequisicao = null;
  
      this.http.get(url).subscribe(
        (data) => {
          console.log('Recebido com sucesso:', data);
          resultadoDaRequisicao = data;
          Swal.fire({
            title: 'Concluído',
            text: 'Uma nova senha foi encaminhada para o seu e-mail',
            icon: 'success',
          });
          this.modalService.closeForgotPasswordModal();
        },
        (error) => {
          Swal.fire({
            title: 'Recuperação falhou',
            text: 'Os dados informados não estão corretos',
            icon: 'error',
          });       
          console.error('Erro ao fazer a requisição:', error);
        }
      );
  
    }
  }
  

  error() {
    
    if (this.email?.touched && this.email?.hasError('email')) {
      console.log('Chamando error');
      this.mostrarSweetAlert('E-mail inválido');
    } 
  }

  mostrarSweetAlert(mensagem: string) {
    Swal.fire({
      title: 'Atenção',
      text: mensagem,
      icon: 'warning'
    });
  }

}
