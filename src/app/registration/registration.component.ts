import { Component, OnInit } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import { UserService } from './../services/index';
import { Constants, AlertService } from './../utils/index';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  loading=false;
  fname = ""; fname_err = "";
  lname = ""; lname_err = "";
  email = ""; email_err = "";
  dob: Date = new Date(Date.now()); dob_err = "";//new Date(new Date().setFullYear(new Date().getFullYear() - 16));
  password = ""; password_err = "";
  confirm = ""; confirm_err = "";

  datePickerOptions: DatepickerOptions = {
    minYear: new Date().getFullYear() - 70,
    maxYear: new Date().getFullYear() + 1,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 1, // 0 - Sunday, 1 - Monday
    minDate: null, // Minimal selectable date
    maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date'
  };

  constructor(private userService: UserService, private alertService: AlertService) {

  }

  ngOnInit() {
  }

  registerUser() {
    document.getElementById("register").setAttribute("disabled","disabled");
    var allGood = true;
    if (this.fname.length < 3) {
      this.fname_err = "Should be atleast 3 characters"; allGood = false;
    } else {
      this.fname_err = ""
    }
    if (this.lname.length < 3) {
      this.lname_err = "Should be atleast 3 characters"; allGood = false;
    } else {
      this.lname_err = ""
    }

    if(this.email == "" || !this.isValidEmail(this.email)){
      this.email_err = "Email address not valid"; allGood = false;
    } else {
      this.email_err = ""
    }

    if (this.password.length < 6 || this.password.length > 30) {
      this.password_err = "Should be between 6 - 30 characters"; allGood = false;
    } 
    else if(!this.isValidPassword(this.password)){
      this.password_err = "Can contain A-Z a-z 0-9 _ - ! @ # $ % & * ( )"; allGood = false;
    }
    else {
      this.password_err = ""
    }
    
    if (this.calculateAge(this.dob) < 16){
      this.dob_err = "Should be atleast 16 years old"; allGood = false;
    } else {
      this.dob_err = "";
    }

    if (this.confirm == "") { this.confirm_err = "Field is required."; allGood = false; } else { this.confirm_err = "" }

    if (this.password != this.confirm) {
      this.confirm_err = "Password doesn't match";
      allGood = false;
    } else {
      this.confirm_err = ""
    }
    if (allGood) {
      this.loading = true;
      this.userService.getByEmail(this.email).subscribe(
        data => {
          if(data.data != undefined) {
            this.email_err = "Email address already in use."
            document.getElementById("register").removeAttribute("disabled");
          } else {
            this.add();
          }
          this.loading = false;
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
    else{
      document.getElementById("register").removeAttribute("disabled");
    }

  }

  add(){
    var dobDate = this.dob.toJSON().split("T")[0];
    this.userService.add(this.fname,this.lname,dobDate,this.email,this.password).subscribe(
      data => {
        this.sendConfirmationEmail()
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
          document.getElementById("register").removeAttribute("disabled");
        }
        catch {  
          this.alertService.error("Server Error: Please try after some time.");
          document.getElementById("register").removeAttribute("disabled");
        }
      }
    );
  }

  sendConfirmationEmail(){
    this.userService.sendConfirmationEmail(this.email).subscribe(
      data => {
        this.loading = false;
        this.alertService.success("Registered successfully. Please check your email for verification link.");
        document.getElementById("register").removeAttribute("disabled");
      },
      error => {
        try{
          this.alertService.error(JSON.parse(error._body).message);
          document.getElementById("register").removeAttribute("disabled");
        }
        catch {  
          this.alertService.error("Server Error: Please try after some time.");
          document.getElementById("register").removeAttribute("disabled");
        }
      }
    );
  }

  public calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  public isValidEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(String(email).toLowerCase());
  }
  public isValidPassword(p) {
    var re = /^[-A-Za-z0-9_!@#$%&*()]*$/
    return re.test(String(p));
  }

}
