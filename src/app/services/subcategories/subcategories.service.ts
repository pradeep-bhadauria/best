import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants, AlertService, AlertComponent } from './../../utils/index';
import {SubCategories} from './../../models/index';
import { map } from 'rxjs/operators';

@Injectable()
export class SubCategoriesService {
  constructor(private http: Http) { }

  getSubCategories(subCategoriesId: number) {
      return this.http.get(
          Constants.API_ENDPOINT + '/sub-categories/' + subCategoriesId, Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }

  count() {
      return this.http.get(
          Constants.API_ENDPOINT + '/sub-categories/count', Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }

  delete(subCategoriesId: number) {
      return this.http.delete(
          Constants.API_ENDPOINT + '/sub-categories/' + subCategoriesId, Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }

  getAll(offset: number, limit: number) {
      return this.http.get(
          Constants.API_ENDPOINT + '/sub-categories/' + offset + "/" + limit, Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }

  getByCategory(catId: number) {
    return this.http.get(
        Constants.API_ENDPOINT + '/sub-categories/categories/' + catId, Constants.jwt()).pipe(map(
            (response: Response) => response.json()
        ));
}

  search(query: String, offset: number, limit: number) {
      let body = undefined;
      body = {
          query: query
      }
      return this.http.post(
          Constants.API_ENDPOINT + '/sub-categories/search/' + offset + "/" + limit, body, Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }

  searchCount(query: String) {
      let body = undefined;
      body = {
          query: query
      }
      return this.http.post(
          Constants.API_ENDPOINT + '/sub-categories/search-count', body, Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }

  update(id: number, name: string, desc: string, cat_id:string) {
      let body = undefined;
      let user = JSON.parse(localStorage.getItem('currentUser'));
      body = {
          sub_cat_name: name,
          sub_cat_desc: desc,
          category: cat_id,
          user: user.id.toString()
      }
      return this.http.put(
          Constants.API_ENDPOINT + '/sub-categories/' + id, body, Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }

  add(name: string, desc: string, cat_id:string) {
      let body = undefined;
      let user = JSON.parse(localStorage.getItem('currentUser'));
      body = {
          sub_cat_name: name,
          sub_cat_desc: desc,
          category: cat_id,
          user: user.id.toString()
      }
      return this.http.post(
          Constants.API_ENDPOINT + '/sub-categories/', body, Constants.jwt()).pipe(map(
              (response: Response) => response.json()
          ));
  }
}
