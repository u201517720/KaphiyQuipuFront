import { Component, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ILogin } from '../../../services/models/login';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  loginModel: ILogin;
  loginFormSubmitted = false;
  isLoginFailed = false;
  errorGeneral: any = { isError: true, errorMessage: '' };
  mensajeErrorGenerico = 'Usuario/password incorrecto.';
  loginForm = new FormGroup({
    username: new FormControl('manuelruiz11@gmail.com', [Validators.required]),
    password: new FormControl('p@ssw0rd', [Validators.required]),
    rememberMe: new FormControl(true)
  });

  constructor(private router: Router, private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) {
  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    this.authService.signinUser(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(res => {
        this.spinner.hide();
        console.log(res);
        this.loginModel = res;
        if (res.Result.Success) {
          if (res.Result.ErrCode == "") {
            this.spinner.hide();
            localStorage.setItem("user", JSON.stringify(this.loginModel));
            this.router.navigate(['/home']);
          }
          else {
            this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
          }
        }
      },
        err => {
          this.isLoginFailed = true;
          this.spinner.hide();
          console.error(err);
        }
      );

  }

  onKeyPressLogin(e) {
    if (e && e.keyCode === 13) {
      this.onSubmit();
    }
  }

}
