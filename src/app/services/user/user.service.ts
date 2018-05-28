import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { UserLevel } from './../../models/index';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getByEmail(email: string) {
    let body = undefined;
    body = {
      user_email: email
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/users/email', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  add(fname: string, lname: string, dob: string, email: string, password: string) {
    let body = undefined;
    body = {
      user_dob: dob,
      user_email: email,
      user_fname: fname,
      user_level: Constants.ROLES.VIEWERS,
      user_lname: lname,
      user_password: password
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/users/', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updatePassword(user_id: string, password: string){
    let body = undefined;
    body = {
      user_password: password
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/users/'+ user_id +'/password', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateEmailLink(user_id: string, first_name:string, email: string){
    let body = undefined;
    body = {
      id: user_id.toString(),
      first_name: first_name,
      email: email
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/change-email-link', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateEmail(user_id: string, email:string, token: string){
    let body = undefined;
    body = {
      id: user_id.toString(),
      token: token,
      email: email
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/change-email', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateName(user_id: string, user_fname: string, user_lname: string){
    let body = undefined;
    body = {
      user_fname: user_fname,
      user_lname: user_lname
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/users/'+ user_id +'/name', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateDob(user_id: string, dob: string){
    let body = undefined;
    body = {
      dob: dob
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/users/'+ user_id +'/dob', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateDoe(user_id: string, doe: string){
    let body = undefined;
    body = {
      doe: doe
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/users/'+ user_id +'/doe', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateIsActive(user_id: string, is_active: string){
    let body = undefined;
    body = {
      is_active: is_active
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/users/'+ user_id +'/active', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateIsBlocked(user_id: string, is_blocked: string){
    let body = undefined;
    body = {
      is_blocked: is_blocked
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/users/'+ user_id +'/blocked', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateUserLevel(user_id: string, user_level: string){
    let body = undefined;
    body = {
      user_level: user_level
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/users/'+ user_id +'/level', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  sendChangePasswordLink(email: String) {
    let body = undefined;
    body = {
      email: email
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/change-password-link', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  sendConfirmationEmail(email: String) {
    let body = undefined;
    body = {
      email: email
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/send-verification-link', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  confirmEmail(email: String, token: String) {
    let body = undefined;
    body = {
      email: email,
      token: token
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/auth/confirm-email', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  confirmChangePassword(email: String, token: String) {
    let body = undefined;
    body = {
      email: email,
      token: token
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/change-password-link-verify', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  contactus(name: String, email: String, subject: String, message: String) {
    let body = undefined;
    body = {
      name: name,
      email: email,
      subject: subject,
      message: message
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/contactus', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  
  login(email: String, password: String) {
    let body = undefined;
    body = {
      email: email,
      password: password
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/auth/login', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }
}
