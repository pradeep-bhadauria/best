import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Constants, AlertService } from './../utils/index';
import { UserService } from './../services/index';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-comfirmemail',
  templateUrl: './comfirmemail.component.html',
  styleUrls: ['./comfirmemail.component.css']
})
export class ComfirmemailComponent implements OnInit {
  loading=false;
  email_err = "";
  constructor(private activatedRoute: ActivatedRoute,private userService: UserService, 
    private alertService: AlertService,
    private meta: Meta,
    private title: Title) { 
    
  }

  ngOnInit() {
    this.meta.updateTag({"robots":"noindex, nofollow"});
    this.title.setTitle("Behind Stories - Confirm Email");

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let email = params['email'];
      let token = params['token'];
      if(email != null && token != null){
        this.userService.confirmEmail(email,token).subscribe(
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
    });
  }

  public isValidEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(String(email).toLowerCase());
  }

  sendActiveLink(email){
    if(this.isValidEmail(email)){
      this.email_err="";
      this.userService.sendConfirmationEmail(email).subscribe(
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
    } else {
      this.email_err = "Please enter a valid email address."
    }
    
  }

}
