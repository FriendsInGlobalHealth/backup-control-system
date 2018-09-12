/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginsService } from '../shared/logins.service';
import { User } from '../../users/shared/user';
import * as CryptoJS from 'crypto-js';
import { NavbarService } from '../../nav-bar/nav-bar.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class LoginFormComponent implements OnInit {
  public user: User = new User();
  public form: FormGroup;
  public loginFail: string = "hide";
  public loginAccess: string = "hide";
  public isDisabled: boolean;
  public localUser = { username: '', password: '' };

   
  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public loginsService: LoginsService,
    public nav: NavbarService
  ) {
    this.form = formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (user) {
      this.router.navigate(['home']);
    }
  }
  /**
   * Handle user authentication
   */
  login() {
    window.sessionStorage.clear();
    this.isDisabled = true;
    this.loginsService.findOneUserByCredentials(this.localUser)
      .subscribe(data => {
        this.user = data;
        if (this.user) {
          if (this.user.enabled == true) {
            var wordArray = CryptoJS.enc.Utf8.parse(this.localUser.password);
            var base64 = CryptoJS.enc.Base64.stringify(wordArray);
            window.sessionStorage.setItem('user', JSON.stringify(this.user));
            window.sessionStorage.setItem('password', base64);
            window.sessionStorage.setItem('authenticated', 'Sim');
            for (let authority of this.user.authorities) {
              window.sessionStorage.setItem(authority.name, 'Sim');
            }
            this.router.navigate(['home']);
            this.nav.callMethodOfSecondComponent();
          } else {
            this.loginAccess = "";
            this.loginFail = "hide";
            this.isDisabled = false;
          }
        } else {
          this.loginAccess = "hide";
          this.loginFail = "";
          this.isDisabled = false;
          this.localUser.password = "";
          this.localUser.username = "";
        }
      }, error => {
        this.loginFail = "";
        this.loginAccess = "hide";
        this.isDisabled = false;
        this.localUser.password = "";
        this.localUser.username = "";
      },
        () => {
        }
      );
  }
}
