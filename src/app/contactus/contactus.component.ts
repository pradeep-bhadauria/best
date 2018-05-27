import { Component, OnInit } from '@angular/core';
import { Constants, AlertService } from './../utils/index';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import {UserService} from './../services/index';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {

  name="";
  name_err="";
  email="";
  email_err="";
  subject="";
  subject_err="";
  message="";
  message_err="";
  send=0;
  constructor(private meta: Meta,
    private title: Title,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.meta.addTag({ "robots": "noindex, nofollow" });
    this.title.setTitle("Behind Stories - Contact Us");
    
  }
  sendMail(){
    this.validName();
    this.validEmail();
    this.validSubject();
    this.validMessage();
    if(this.send == 4){
      this.userService.contactus(this.name, this.email, this.subject, this.message).subscribe(
        data=>{
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

  validName(){
    this.name_err="";
    if(this.name.trim() == ""){
      this.name_err = "Name is required";
    }
    else if(this.name.length > 3 && this.name.length <= 50){
      this.send=this.send+1;
    } else {
      this.name_err = "Name can be 3-50 characters long";
    }
  }

  validSubject(){
    this.subject_err="";
    if(this.subject.trim() == ""){
      this.subject_err = "Subject is required";
    }
    else if(this.subject.length > 0 && this.subject.length <= 100){
      this.send=this.send+1;
    } else {
      this.subject_err = "Subject can be 1-100 characters long";
    }
  }

  validMessage(){
    this.message_err="";
    if(this.message.trim() == ""){
      this.message_err = "Message is required";
    }
    else if(this.message.length >= 10 && this.message.length <= 500){
      this.send=this.send+1;
    } else {
      this.message_err = "Message can be 10-500 characters long";
    }
  }

  validEmail(){
    this.email_err ="";
    if(this.email.trim() == ""){
      this.email_err = "Email is required";
    }
    else if(this.isValidEmail()){
      this.send=this.send+1;
    } else {
      this.email_err = "Invalid email address";
    }
  }

  public isValidEmail() {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(String(this.email).toLowerCase());
  }
}
