import { Component, OnInit } from '@angular/core';
import { ProfileService, UserService, PageService } from './../services/index';
import { Constants, AlertService } from './../utils/index';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = null;
  active = "myarticles";

  articleCount = 0;
  myArticles = Array();
  offset = 0;
  limit = Constants.DEFAULT.TABLE_PAGINATION_LIMIT;


  more="Load More";
  fname="";
  fname_err="";
  lname="";
  lname_err="";
  password="";
  password_err="";
  confirm="";
  confirm_err="";
  email="";
  email_err="";

  constructor(
    private profileService: ProfileService,
    public alertService: AlertService,
    private route: ActivatedRoute,
    private userService: UserService,
    private pageService: PageService,private meta: Meta,
    private title: Title
  ) {
    
  }
  ngOnInit(){
    this.meta.addTag({"robots":"noindex, nofollow"});
    this.title.setTitle("Behind Stories - Profile");

    this.route.params.subscribe(params => {
      if (params['module'] != undefined) {
        this.active = params['module'].trim();
      }
    });

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if(this.user == null){
      document.location.href = "/login"
    }

    this.route.queryParams.subscribe(params => {
      var email="", id=null, token="";
      if (params['email'] != undefined || params['token'] != undefined || params['check'] != undefined) {
        if(params['email'] != undefined)
          email = params['email'];
        if(params['token'] != undefined)
          token = params['token'];
        if(params['check'] != undefined)
          id = +params['check'];
        if(email!="" && id!=null && token != ""){
          if(this.user.id == id){
            Constants.showLoader();
            this.userService.updateEmail(id, email, token).subscribe(
              data=>{this.alertService.success(data.message);},
              error=>{
                try{
                  Constants.hideLoader();
                  this.alertService.error(JSON.parse(error._body).message);
                }
                catch {  
                  Constants.hideLoader();
                  this.alertService.error("Server Error: Please try after some time.");
                }
              }
            );
          } else {
            this.alertService.error("Error: Invalid request");  
          }
        } else {
          this.alertService.error("Error: Invalid request");  
        }
      }
    });

    this.getMyArticlesCount();
    this.getMyArticles();
  }

  getMyArticles(){
    this.profileService.getMyArticles(this.offset, this.limit).subscribe(
      data => {
        if (data.data != undefined) {
          JSON.parse(data.data).forEach(element => {
            this.myArticles.push(element);  
          });
        }
        this.more="Load More";
      }
    );
  }

  getMyArticlesCount() {
    this.profileService.getMyArticlesCount().subscribe(
      data => {
        if (data.data != undefined) {
          this.articleCount = JSON.parse(data.data).count;
        }
      }
    );
  }

  getMore(){
    this.offset = this.offset + this.limit;
    this.more="Loading...";
    if(this.offset < this.articleCount ){
      this.getMyArticles();
    } else {
      document.getElementById("get-more").setAttribute("disabled","disabled");
      this.more="No More Articles Here";
    }
  }


  changeEmail(){
    if(this.validate("email")){
      this.userService.updateEmailLink(this.user.id, this.user.fname, this.email).subscribe(
        data => {
          this.alertService.success(data.message);
        },
        error=>{
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

  changePassword(){
    if(this.validate("password")){
      this.userService.updatePassword(this.user.id, this.password).subscribe(
        data => {
          this.alertService.success(data.message);
        },
        error=>{
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

  changeName(){
    if(this.validate("name")){
      this.userService.updateName(this.user.id, this.fname, this.lname).subscribe(
        data => {
          this.alertService.success(data.message + " We are logging you out for name to reflect.");
          setTimeout(function(){
            localStorage.removeItem("currentUser");
            document.location.href = "/login";
          },5000);
        },
        error=>{
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

  deleteArticle(article_id:number){
    if(confirm("Warning! Are you sure you want to delete? You will lose all content!.")){
      this.pageService.deleteArticle(article_id).subscribe(
        data=>{
          this.alertService.success("Article deleted successfully");
          document.getElementById("article_"+article_id).remove();
        },
        error=>{
          this.alertService.error("Error: We are unable to delete this article now. Please try after sometime.");
        }
      );
    }
  }

  validate(name: string){
    var allGood = true;
    if(name=="name"){
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
    } else if (name=="email"){
      if(this.email == "" || !this.isValidEmail(this.email)){
        this.email_err = "Email address not valid"; allGood = false;
      } else {
        this.email_err = ""
      }
    } else if (name=="password"){
      if (this.password.length < 6 || this.password.length > 30) {
        this.password_err = "Should be between 6 - 30 characters"; allGood = false;
      } 
      else if(!this.isValidPassword(this.password)){
        this.password_err = "Can contain A-Z a-z 0-9 _ - ! @ # $ % & * ( )"; allGood = false;
      }
      else {
        this.password_err = ""
      }
      
      if (this.confirm == "") { this.confirm_err = "Field is required."; allGood = false; } else { this.confirm_err = "" }

      if (this.password != this.confirm) {
        this.confirm_err = "Password doesn't match";
        allGood = false;
      } else {
        this.confirm_err = ""
      }
    }
    return allGood;
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
