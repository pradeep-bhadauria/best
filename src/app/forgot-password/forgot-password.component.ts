import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Constants, AlertService } from './../utils/index';
import { UserService } from './../services/index';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private userService: UserService, private alertService: AlertService,
    private meta: Meta,
    private title: Title) { }
  loading=false;
  email_err="";
  display=false;
  password_err="";
  confirm_err="";
  user_id = null;
  ngOnInit() {
    this.meta.updateTag({"robots":"noindex, nofollow"});
    this.title.setTitle("Behind Stories - Forgot Password");

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let email = params['email'];
      let token = params['token'];
      if(email != null && token != null){
        this.userService.confirmChangePassword(email,token).subscribe(
          data => {
            this.loading = false;
            this.display=true;
            this.alertService.success("Successfully verified account. You can now change your password.");
            this.user_id = data.data.id;
          },
          error => {
            try{
              this.alertService.error(JSON.parse(error._body).message);
            }
            catch {
              this.alertService.error("Server Error: Please try after some time.");  
            }
          }
        );
      }
    });
  }
  
  public isValidEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(String(email).toLowerCase());
  }

  sendChangeLink(email: string){
    this.email_err="";
    if(email.trim().length == 0){
      this.email_err="Email field cannot be empty.";
    } else if(!this.isValidEmail(email)) {
      this.email_err = "Please enter a valid email address."
    }
    else{
      this.email_err="";
      this.userService.sendChangePasswordLink(email).subscribe(
        data => {
          this.loading = false;
          this.alertService.success(data.message);
        },
        error => {
          try{
            this.alertService.error(JSON.parse(error._body).message);
          }
          catch {  
            this.alertService.error("Server Error: Please try after some time.");  
          }
        }
      );
    }
  }

  public isValidPassword(p) {
    var re = /^[-A-Za-z0-9_!@#$%&*()]*$/
    return re.test(String(p));
  }

  changePassword(password, confirm){
    this.confirm_err = "";
    this.password_err = "";
    if (password.length < 6 || password.length > 30) {
      this.password_err = "Should be between 6 - 30 characters";
    } else if(this.isValidPassword(password)){
      if(password == confirm){
        if(this.user_id != null) {
          this.userService.updatePassword(this.user_id, password).subscribe(
            data => {
              this.alertService.success("Password updated successfully");
            },
            error => {
              this.alertService.success("Error updating password try after sometime.");
            }
          );
        }
      } else {
        this.confirm_err = "Password doesnt match"
      }
    } else {
      this.password_err = "Password can contain only A-Z a-z 0-9 _ - ! @ # $ % & * ( )"
    }
  }

}
