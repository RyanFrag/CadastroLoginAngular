  import { Component  } from '@angular/core';
  import { FormGroup, Validators, FormControl } from '@angular/forms';
  import { HttpClient } from '@angular/common/http';
  import { ViewChild, ElementRef } from '@angular/core';

  import { ValidationMessages, ValidationMessage } from '../validation-messages';
  import Swal from 'sweetalert2';
  @Component({
    selector: 'app-logon',
    templateUrl: './logon.component.html',
    styleUrls: ['./logon.component.css'],

  })
  export class LogonComponent   {
    private baseUrl = 'https://api.crmsc.org.br/crvirtual-pessoafisica-services/servicos1/pf';
    private url = "http://localhost:8080/users"
    public responseData: any; 
    error404: boolean = false;
    errorSending: boolean = false;
    errorEmail : boolean = false;
    errorName : boolean = false;
    errorCpf : boolean = false;
    errorDate : boolean = false;
    errorCrm : boolean = false;
    errorPassword : boolean = false;
    errorConfirmPassword : boolean = false;
    errorConfirmEmail : boolean = false;

    @ViewChild('submitButton') submitButton!: ElementRef;
    successMessage:string = '';

    visiblePassword1 = false;
    visiblePassword2 = false;
    changetype1 = true;
    changetype2 = true;

    isCrmEnabled = false;
    passwordStrength: number = 0;
    form!: FormGroup 
    inputId: string = '';
    cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    errorMessages: { control: string, type: string, message: string }[] = [];
    validationMessages: ValidationMessages = {
      crm: [
        { type: 'required', message: 'Registro de CRM é obrigatório' },
      ],
      name: [
        { type: 'required', message: 'Nome é obrigatório' },
      ],
      cpf: [
        { type: 'required', message: 'CPF é obrigatório' },
        { type: 'pattern', message: 'CPF inválido' },
      ],
      date: [
        { type: 'required', message: 'A data é obrigatória' },
      ],
      email: [
        { type: 'required', message: 'Email é obrigatório' },
        { type: 'email', message: 'Email deve ser válido' },
      ],
      confirmEmail: [
        { type: 'required', message: 'Confirmação de email é obrigatória' },
        { type: 'email', message: 'Confirmação de email deve ser válida' },
      ],
      password: [
        { type: 'required', message: 'Senha é obrigatória' },
        { type: 'minlength', message: 'Senha deve ter pelo menos 4 caracteres' },
      ],
      confirmPassword: [
        { type: 'required', message: 'Confirmação de senha é obrigatória' },
        { type: 'minlength', message: 'Confirmação de senha deve ter pelo menos 4 caracteres' },
      ],
      
    };

    
    constructor(private http: HttpClient) { }

    ngOnInit(): void {
      this.form = new FormGroup({
        crm: new FormControl({ value: '', disabled: true }, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        cpf: new FormControl('', [Validators.required, Validators.pattern(this.cpfPattern)]),
        date: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        confirmEmail: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      })
    }
      get crm() { return this.form.get('crm'); }
      get name() { return this.form.get('name'); }
      get cpf() { return this.form.get('cpf'); }
      get date() { return this.form.get('date'); }
      get email() { return this.form.get('email'); }
      get confirmEmail() { return this.form.get('confirmEmail'); }
      get password() { return this.form.get('password'); }
      get confirmPassword() { return this.form.get('confirmPassword'); }

      formControls = ['crm', 'name', 'cpf', 'date', 'email', 'confirmEmail', 'password', 'confirmPassword'];

      getValidationErrors(controlName: string): ValidationMessage[] {
        const control = this.form.get(controlName);
        const errors: ValidationMessage[] = [];
      
        if (control && control.errors) {
          for (const errorType in control.errors) {
            if (control.errors.hasOwnProperty(errorType)) {
              const errorConfig = this.validationMessages[controlName].find(config => config.type === errorType);
              if (errorConfig) {
                errors.push(errorConfig);
              } else {
                errors.push({ type: errorType, message: `Erro de validação: ${errorType}` });
              }
            }
          }
        }
        return errors;
      }
      
      onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }

      onClick(event: Event) {
        event.preventDefault();
      }
    
      viewPass(fieldNumber: number, event: Event) {
        event.preventDefault();
        if (fieldNumber === 1) {
          this.visiblePassword1 = !this.visiblePassword1;
          this.changetype1 = !this.changetype1;
        } else if (fieldNumber === 2) {
          this.visiblePassword2 = !this.visiblePassword2;
          this.changetype2 = !this.changetype2;
        }

      }
  

    toggleCrmField(): void {
      this.isCrmEnabled = !this.isCrmEnabled;
      this.name?.reset();
      this.cpf?.reset();
      this.date?.reset();
      this.email?.reset();
      this.confirmEmail?.reset();
      this.password?.reset();
      this.confirmPassword?.reset();

      if (this.isCrmEnabled) {
        this.crm?.enable();
        
        this.name?.disable();
        this.cpf?.disable();
        this.date?.disable();
        this.email?.disable();
        this.confirmEmail?.disable();
        this.password?.disable();
        this.confirmPassword?.disable();
        this.submitButton.nativeElement.disabled = true;

      } else {
        this.crm?.reset();
        this.crm?.disable();
        this.name?.enable();
        this.cpf?.enable();
        this.date?.enable();
        this.email?.enable();
        this.confirmEmail?.enable();
        this.password?.enable();
        this.confirmPassword?.enable();
        this.submitButton.nativeElement.disabled = false;

      }
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

    validateCrmInput(event: any): void {
      const inputChar = String.fromCharCode(event.charCode);
      const pattern = /^[0-9]*$/;
    
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

    checkPasswordStrength() {
      const password = this.password?.value as string;
      const length = password.length;

      if (length == 0) {
        this.passwordStrength = 0;
      } else if (length <= 4) {
        this.passwordStrength = 30;
      } else if (length <= 6) {
        this.passwordStrength = 70;
      } else if (length <= 8) {
        this.passwordStrength = 100;
      }
    }

    onSubmit() {
      this.errorMessages = [];
      
        const password = this.password?.value;
        const email = this.email?.value;
        const confirmPassword = this.confirmPassword?.value;
        const confirmEmail = this.confirmEmail?.value;
        const crm =  this.crm?.value;
        const name =  this.name?.value;
        const cpf =  this.cpf?.value;
        const date =  this.date?.value;
      
      
        this.errorName = !name;
        this.errorCpf = !cpf;
        this.errorDate = !date;
        this.errorEmail = !email;
        this.errorConfirmEmail = !confirmEmail;
        this.errorPassword = !password;
        this.errorConfirmPassword = !confirmPassword;




    
        if (email !== confirmEmail || password !== confirmPassword || this.errorName) {
          this.errorSending = true;
        }
        if(this.errorEmail || this.errorConfirmEmail || this.errorPassword || this.errorConfirmPassword || this.errorCpf || this.errorDate) {
          this.errorSending = true;
        }
        if (this.errorSending) {
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
        } else {
          const dataToSend = {
            "nome": this.name?.value,
            "cpf": this.cpf?.value,
            "dataNascimento": this.date?.value ? new Date(this.date.value).toISOString().substring(0, 10) : null,
            "email": this.email?.value,
            "senha": this.password?.value
          };
          this.errorMessages = [];
          this.successMessage = 'Cadastro concluído com sucesso';
          this.http.post(this.url, dataToSend).subscribe(
            (response) => {
              console.log('Dados enviados com sucesso:', response);
              Swal.fire({
                title: 'Concluído',
                text: "Usuário cadastrado com sucesso!",
                icon: 'success',
              });
            },
            (error) => {
              console.error('Erro ao fazer POST request:', error);
            }
          );
        }
      
    }
    
    
    error() {
      if (this.email?.touched && this.email?.hasError('email')) {
        this.mostrarSweetAlert('E-mail inválido');
      } 
      if(this.confirmEmail?.touched && this.confirmEmail?.hasError('email')) {
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

    isEmailFieldDisabled(): boolean {
      const emailControl = this.form.get('email');
      return emailControl ? emailControl.disabled : false;
    }
    
    fetchData(id: string): void {
      const trimmedId = id.trim();
      if (trimmedId) {   
        this.http.get<any>(`${this.baseUrl}/${trimmedId}`).subscribe(
        (data) => {
          this.responseData = data;
    
          this.form.get('name')?.setValue(data.nome);
          this.error404 = false; 
    
          this.cpf?.enable();
          this.date?.enable();
          this.email?.enable();
          this.confirmEmail?.enable();
          this.password?.enable();
          this.confirmPassword?.enable();
          this.submitButton.nativeElement.disabled = false;

        },
        (error) => {  
          console.error('Error fetching data:', error);
          this.error404 = true;
        });
      }
    }
  }