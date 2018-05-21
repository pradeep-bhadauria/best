import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { Keywords } from './../../models';
import { map } from 'rxjs/operators';

@Injectable()
export class CMSService {

  constructor(private http: Http) { }

  uploadImages(formData: FormData, article_id: number) {
    let headers = new Headers();
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Authorization', 'Bearer ' + currentUser.token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Constants.API_ENDPOINT + '/upload/images/' + article_id, formData, options).pipe(map(
      (response: Response) => response.json()
    ));
  }

  getCountries() {
    return this.http.get(Constants.API_ENDPOINT + '/countries/').pipe(map(
      (response: Response) => response.json()
    ));
  }

  getArticleById(article_id: number) {
    return this.http.get(Constants.API_ENDPOINT + '/articles/' + article_id).pipe(map(
      (response: Response) => response.json()
    ));
  }

  add(cat_id: string, sub_cat_id: string, subject: string,overview:string, keywords, images, country: string, state: string, content: string, city: string) {
    let body = undefined;
    let user = JSON.parse(localStorage.getItem('currentUser'));
    var keywordList = Array();
    keywords.trim().split(" ").forEach(element => {
      keywordList.push({ "keyword": element.toString() });
    });
    body = {
      category: cat_id.toString(),
      sub_category: sub_cat_id.toString(),
      user: user.id.toString(),
      subject: subject.trim().toString(),
      overview: overview.toString().trim(),
      keywords: keywordList,
      images: images,
      body: content.trim().toString(),
      country: country.trim().toString(),
      state: state.trim().toString(),
      city: city.trim().toString(),
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/articles/', body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  update(article_id: string, cat_id: string, sub_cat_id: string, subject: string,overview:string, keywords, images, country: string, state: string, content: string, city: string) {
    let body = undefined;
    let user = JSON.parse(localStorage.getItem('currentUser'));
    var keywordList = Array();
    keywords.trim().split(" ").forEach(element => {
      keywordList.push({ "keyword": element.toString() });
    });
    body = {
      category: cat_id.toString(),
      sub_category: sub_cat_id.toString(),
      user: user.id.toString(),
      subject: subject.trim().toString(),
      overview: overview.toString().trim(),
      keywords: keywordList,
      images: images,
      body: content.trim().toString(),
      country: country.trim().toString(),
      state: state.trim().toString(),
      city: city.trim().toString(),
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/articles/' + article_id, body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  publish(article_id:number, is_published:number){
    let body = undefined;
    body = {
      is_published: is_published
    }
    return this.http.put(
      Constants.API_ENDPOINT + '/articles/' + article_id + "/publish", body, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }
}
