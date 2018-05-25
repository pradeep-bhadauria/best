import { Headers, RequestOptions } from '@angular/http';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class Constants {
  public static API_ENDPOINT = 'http://ws.behindstories.com';
  //public static API_ENDPOINT='http://localhost:5000';

  public static LOADING = false;
  @Inject(PLATFORM_ID) public static platformId: Object;
  public static ROLES = {
    ADMIN: 2,
    VIEWERS: 28,
    AUTHORS: 29
  }
  public static DEFAULT = {
    PUBLISHED: 1,
    OFFSET: 0,
    TABLE_PAGINATION_LIMIT: 10,
    TABLE_PAGE_OPTIONS: [10, 25, 50, 100],
    POPULAR_ARTICLE_LIMIT:3,
    RECENT_ARTICLE_LIMIT:3,
  }

  public static jwt() {
    if (isPlatformBrowser(this.platformId)) {
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser && currentUser.token) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
        return new RequestOptions({ headers: headers });
      }
    }
  }

  public static showLoader() {
    document.getElementById("preloader").style.removeProperty("display");
    document.getElementById("status").style.removeProperty("display");
  }

  public static hideLoader() {
    document.getElementById("preloader").style.setProperty("display", "none");
    document.getElementById("status").style.setProperty("display", "none");
  }

  public static CATEGORIES = {
    LIFESTYLE: "Lifestyle",
    ENTERTAINMENT: "Entertainment",
    TECHNOLOGY: "Technology",
    BUSINESS: "Business",
    NEWS: "News",
    SPORTS: "Sports",
    HUMOUR: "Humour"
  }

  public static META_DEFAULT = {
    DESCRIPTION: "Latest news, sport, technologies, life and style, business, entertainment and a whole lot more. The Behind Stories informs, educates and entertains - wherever you are, whatever your age.",
    IMAGE:"http://www.behindstories.com/assets/img/favicon-256.png",
    TITLE:"Behind Stories - Home",
    TWITTER_USER:"@BehindStories",
    FB_ADMIN: "100026083039160",
    FB_APP_ID:"242326843180688",
    SITE_NAME: "Behind Stories",
    SITE_URL: "http://www.behindstories.com",
    FOLLOW: "index, follow",
    NO_FOLLOW:"noindex, nofollow"
  }
}