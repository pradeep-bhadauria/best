import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import { Categories } from './../../models/index';
import { map } from 'rxjs/operators';

@Injectable()
export class PageService {

  constructor(private http: Http) { }

  getCategoryByName(name: string) {
    return this.http.get(
      Constants.API_ENDPOINT + '/categories/name/' + name, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  getSubCategoryByName(name: string) {
    return this.http.get(
      Constants.API_ENDPOINT + '/sub-categories/name/' + name, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  getArticleByUid(uid: string) {
    return this.http.get(
      Constants.API_ENDPOINT + '/articles/uid/' + uid, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  getPublishedArticleByCategory(cat_id: number, offset: number, limit: number) {
    return this.http.get(
      Constants.API_ENDPOINT + '/articles/search/' + cat_id + "/" + offset + "/" + limit, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  searchPublishedArticles(q: string, offset: number, limit: number) {
    var json = {
      query: q
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/articles/search/' + offset + "/" + limit, json, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  searchPublishedArticlesCount(q: string) {
    var json = {
      query: q
    }
    return this.http.post(
      Constants.API_ENDPOINT + '/articles/search/count', json, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  getPublishedArticleByCategoryCount(cat_id: number) {
    return this.http.get(
      Constants.API_ENDPOINT + '/articles/search/' + cat_id + "/count", Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  getPublishedArticleBySubCategory(cat_id: number,sub_cat_id: number, offset: number, limit: number) {
    return this.http.get(
      Constants.API_ENDPOINT + '/articles/search/' + cat_id + "/" + sub_cat_id + "/" + offset + "/" + limit, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  getPublishedArticleBySubCategoryCount(cat_id: number,sub_cat_id: number) {
    return this.http.get(
      Constants.API_ENDPOINT + '/articles/search/' + cat_id + "/" + sub_cat_id + "/count", Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  deleteArticle(article_id: number) {
    return this.http.delete(
      Constants.API_ENDPOINT + '/articles/' + article_id, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  popularArticles() {
    return this.http.get(
      Constants.API_ENDPOINT + '/articles/search/popularity/0/' + Constants.DEFAULT.POPULAR_ARTICLE_LIMIT, Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  updateViews(article_id: number) {
    return this.http.put(
      Constants.API_ENDPOINT + '/articles/' + article_id + '/checked', Constants.jwt()).pipe(map(
        (response: Response) => response.json()
      ));
  }

  relatedArticles(cat_id: number, sub_cat_id: number, article_id: number) {
    if(cat_id != null && sub_cat_id != null && article_id != null){
      return this.http.get(
        Constants.API_ENDPOINT + '/articles/search/related/'+ cat_id + '/' + sub_cat_id + '/' + article_id + '/0/' + Constants.DEFAULT.POPULAR_ARTICLE_LIMIT, Constants.jwt()).pipe(map(
          (response: Response) => response.json()
        ));
    } 
    else if(cat_id != null && sub_cat_id != null && article_id == null){
      return this.http.get(
        Constants.API_ENDPOINT + '/articles/search/related/'+ cat_id + '/' + sub_cat_id +'/0/' + Constants.DEFAULT.POPULAR_ARTICLE_LIMIT, Constants.jwt()).pipe(map(
          (response: Response) => response.json()
        ));
    }
    else if(cat_id != null && sub_cat_id == null && article_id == null){
      return this.http.get(
        Constants.API_ENDPOINT + '/articles/search/related/'+ cat_id +'/0/' + Constants.DEFAULT.POPULAR_ARTICLE_LIMIT, Constants.jwt()).pipe(map(
          (response: Response) => response.json()
        ));
    }
  }

  getIPLocation(){
    /*this.http.get("http://freegeoip.net/json/").subscribe(data => {
      console.log(data);
      this.http.get("http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139").subscribe(data => {
        console.log(data);
      })
    })*/
  }

}
