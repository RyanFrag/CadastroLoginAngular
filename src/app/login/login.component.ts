import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup  } from '@angular/forms';	
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../modal-service.service';

import Swal from 'sweetalert2';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorEmail: boolean = false;
  errorSenha: boolean = false;

  visible = true;
  changetype = true;
  form!: FormGroup;
  private url = "http://localhost:8080/users"
  resultadoDaRequisicao: any;
  mensagemDeErro:any;

  constructor(private http: HttpClient, private modalService: ModalService ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
    })
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  
  viewPass(event: Event)
  {
    event.preventDefault();
    this.visible = !this.visible
    this.changetype = !this.changetype
  }

  onSubmit() {
    const email = this.email?.value;
    const senha = this.password?.value;
    this.errorEmail = !email; 
    this.errorSenha = !senha; 
    
  
    if (!this.errorEmail && !this.errorSenha) {
      const url = `http://localhost:8080/users/login?email=${email}&senha=${senha}`;
  
      this.mensagemDeErro = null;
      this.resultadoDaRequisicao = null;
  
      this.http.get(url).subscribe(
        (data) => {
          console.log('Recebido com sucesso:', data);
          this.resultadoDaRequisicao = data;
        },
        (error) => {
          Swal.fire({
            position: "top-end",
            title: "<div class='custom-swal-title'><i class='fa fa-times-circle'></i> Erro</div>",
            text: "Email ou senha incorretos.",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'custom-swal-popup-class' 
            }
          });          
          
          console.error('Erro ao fazer a requisição:', error);
        }
      );
    }
  }
  
  
  openForgotPasswordModal() {
    this.modalService.openForgotPasswordModal();
  }



  
  error() {
    if (this.email?.touched && this.email?.hasError('email')) {
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
  

