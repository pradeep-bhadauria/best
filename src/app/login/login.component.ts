import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/index';
import { Constants, AlertService } from './../utils/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = "";
  email_err = "";
  password = "";
  loading = false;
  returnUrl="";
  constructor(private userService: UserService, private alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit() {
    // reset login status
    localStorage.removeItem('currentUser');
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    if (this.isValidEmail(this.email)) {
      this.loading = true;
      this.email_err = "";
      document.getElementById("login").setAttribute("disabled", "disabled");
      this.userService.login(this.email, this.password).subscribe(
        data => {
          this.loading = false;
          if (data.data != undefined) {
            let user = JSON.parse(data.data);
            if (user) {
              var currentUser = {
                id: user.id,
                fname: user.user_fname,
                lname: user.user_lname,
                email: user.user_email,
                token: user.token,
                tid: user.user_level.id
              };
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
              document.location.href = this.returnUrl;
            }
          }
          document.getElementById("login").removeAttribute("disabled");
        },
        error => {
          try {
            this.alertService.error(JSON.parse(error._body).message);
            document.getElementById("login").removeAttribute("disabled");
          }
          catch {
            this.alertService.error("Server Error: Please try after some time.");
            document.getElementById("login").removeAttribute("disabled");
          }
        }
      );
    } else {
      this.email_err = "Invalid email address.";
    }
  }

  public isValidEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(String(email).toLowerCase());
  }

}
