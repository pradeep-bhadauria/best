import { Component, OnInit, ViewEncapsulation, PLATFORM_ID, Inject } from '@angular/core';
import { Constants, AlertService } from './../utils/index';
import { PageService } from './../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PageComponent implements OnInit {
  query = "";
  infiniteScrollCount = 0;
  offset = 0;
  limit = Constants.DEFAULT.TABLE_PAGINATION_LIMIT;
  htmlVariable = "";
  displayFlag = 0;
  url = null;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  category = null;
  cat_id = null;
  subcategory = null;
  sub_cat_id = null;
  article = null;
  articeBySearch = '';
  articeByCategory = '';
  articeBySubCategory = '';
  article_id = null;
  uid = null;
  relatedArticlesList = null;
  viewedList = new Array();
  more = "Load More";


  constructor(
    public alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private sanitizer: DomSanitizer,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['category'] != undefined) {
        this.category = params['category'];
        this.checkCategory(params);
      } else {
        document.getElementById("comments").classList.add("hide");
        this.route.queryParams.subscribe(params => {
          if (params['q'] != undefined) {
            this.query = params['q'];
            this.displayFlag = 4;
            this.searchPublishedArticlesCount();
          }
        });
      }
    });
  }

  searchPublishedArticles() {
    this.pageService.searchPublishedArticles(this.query, this.offset, this.limit).subscribe(
      data => {
        this.title.setTitle("Behind Stories: " + this.query);
        var articles = JSON.parse(data.data);
        var html = this.makeContent(articles);
        this.articeBySearch += html;
      }
    );
  }

  searchPublishedArticlesCount() {
    this.pageService.searchPublishedArticlesCount(this.query).subscribe(
      data => {
        this.infiniteScrollCount = JSON.parse(data.data).count;
        this.searchPublishedArticles();
      }
    );
  }

  checkCategory(params) {
    this.pageService.getCategoryByName(this.category).subscribe(
      data => {
        if (data.data != undefined) {
          var cat = JSON.parse(data.data);
          this.category = cat.name;
          this.cat_id = cat.id;
          if (params['subcategory'] != undefined) {
            this.subcategory = params['subcategory'];
            this.checkSubCategory(params);
          } else {
            document.getElementById("comments").classList.add("hide");
            this.getArticlesByCategory();
            this.relatedArticles();
          }
        } else {
          document.location.href = "/404";
        }
      },
      error => {
        this.alertService.error("Server Error: Please try after some time.");
      }
    );
  }

  checkSubCategory(params) {
    this.pageService.getSubCategoryByName(this.subcategory).subscribe(
      data => {
        if (data.data != undefined) {
          var sub_cat = JSON.parse(data.data);
          this.sub_cat_id = sub_cat.id;
          this.subcategory = sub_cat.name;
          if (params['article'] != undefined) {
            this.uid = params['article'];
            this.getArticleByUid();
          } else {
            document.getElementById("comments").classList.add("hide");
            this.getArticlesBySubCategory();
            this.relatedArticles();
          }
        } else {
          document.location.href = "/404";
        }
      },
      error => {
        this.alertService.error("Server Error: Please try after some time.");
      }
    );
  }

  getArticlesByCategory() {
    this.pageService.getPublishedArticleByCategory(this.cat_id, this.offset, this.limit).subscribe(
      data => {
        try {
          this.title.setTitle("Behind Stories: " + this.category);
          var cat = JSON.parse(data.data);
          this.getCategoryCount();
          var html = this.makeContent(cat);
          this.articeByCategory += html;
          this.relatedArticles();
        } catch {
          this.articeByCategory = '';
        }
        this.displayFlag = 1;
      }
    );
  }

  getArticlesBySubCategory() {
    this.pageService.getPublishedArticleBySubCategory(this.cat_id, this.sub_cat_id, this.offset, this.limit).subscribe(
      data => {
        try {
          var sub_cat = JSON.parse(data.data);
          this.title.setTitle("Behind Stories: " + this.category + " - " + this.subcategory);
          this.getSubCategoryCount();
          var html = this.makeContent(sub_cat);
          this.articeBySubCategory += html;
        } catch {
          this.articeBySubCategory = '';
        }
        this.displayFlag = 2;
      }
    );
  }

  getArticleByUid() {
    this.url = document.location.href;
    this.pageService.getArticleByUid(this.uid).subscribe(
      data => {
        if (data.data != undefined) {
          var temp = JSON.parse(data.data);
          this.article_id = temp.id;
          if (this.currentUser == null && temp.is_published != Constants.DEFAULT.PUBLISHED) {
            document.location.href = "/404";
          } else if (this.currentUser != null &&
            this.currentUser.id != temp.author.id &&
            temp.is_published != Constants.DEFAULT.PUBLISHED &&
            this.currentUser.tid != Constants.ROLES.ADMIN) {
            document.location.href = "/404";
          } else {
            this.article = temp;
            this.article.body = this.sanitizer.bypassSecurityTrustHtml(this.article.body)
            var keyword = "";
            this.article.keywords.forEach(element => {
              keyword = keyword + " " + element.keyword;
            });

            this.meta.addTag({ name: "robots", content: Constants.META_DEFAULT.FOLLOW });
            this.meta.addTag({ name: "description", content: this.article.overview });
            this.meta.addTag({ name: "keywords", content: keyword.trim() });
            this.meta.addTag({ name: "image", content: this.article.images.banner });
            this.meta.addTag({ itemprop: "name", content: this.article.subject });
            this.meta.addTag({ itemprop: "description", content: this.article.overview });
            this.meta.addTag({ itemprop: "image", content: this.article.images.banner });
            this.meta.addTag({ name: "twitter:card", content: "summary" });
            this.meta.addTag({ name: "twitter:title", content: this.article.subject });
            this.meta.addTag({ name: "twitter:description", content: this.article.overview });
            this.meta.addTag({ name: "twitter:site", content: Constants.META_DEFAULT.TWITTER_USER });
            this.meta.addTag({ name: "twitter:creator", content: Constants.META_DEFAULT.TWITTER_USER });
            this.meta.addTag({ name: "twitter:image:src", content: this.article.images.banner });
            this.meta.addTag({ name: "og:title", content: this.article.subject });
            this.meta.addTag({ name: "og:description", content: this.article.overview });
            this.meta.addTag({ name: "og:image", content: this.article.images.banner });
            this.meta.addTag({ name: "og:url", content: Constants.META_DEFAULT.SITE_URL });
            this.meta.addTag({ name: "og:site_name", content: Constants.META_DEFAULT.SITE_NAME });
            this.meta.addTag({ name: "fb:admins", content: Constants.META_DEFAULT.FB_ADMIN });
            this.meta.addTag({ name: "fb:app_id", content: Constants.META_DEFAULT.FB_APP_ID });
            this.meta.addTag({ name: "og:type", content: "website" });
            this.title.setTitle(this.article.subject);

            this.displayFlag = 3;
            this.relatedArticles();
            this.pageView();
          }
        } else {
          document.location.href = "/404"
        }
      },
      error => {
        this.alertService.error("Server Error: Please try after some time.");
      }
    );
  }

  getMore() {
    this.offset = this.offset + this.limit;
    if (this.offset < this.infiniteScrollCount) {
      if (this.displayFlag == 1) {
        this.getArticlesByCategory();
      } else if (this.displayFlag == 2) {
        this.getArticlesBySubCategory();
      } else if (this.displayFlag == 4) {
        this.searchPublishedArticles();
      }
    } else {
      document.getElementById("get-more").setAttribute("disabled", "disabled");
      this.more = "No More Articles Here";
    }
  }

  getCategoryCount() {
    this.pageService.getPublishedArticleByCategoryCount(this.cat_id).subscribe(
      data => {
        this.infiniteScrollCount = JSON.parse(data.data).count;
      }
    )
  }

  getSubCategoryCount() {
    this.pageService.getPublishedArticleBySubCategoryCount(this.cat_id, this.sub_cat_id).subscribe(
      data => {
        this.infiniteScrollCount = JSON.parse(data.data).count;
      }
    )
  }

  pageView() {
    if (isPlatformBrowser(this.platformId)) {
      var a = localStorage.getItem('aid');
      if (a != undefined || a != null) {
        this.viewedList = JSON.parse(a);
        var map = this.makeMap(this.viewedList);
        if (!map.has(this.article_id)) {
          this.updateView();
        }
      } else {
        this.viewedList.push({ k: this.article_id });
        localStorage.setItem("aid", JSON.stringify(this.viewedList));
      }
    }
  }

  makeMap(list) {
    var viewedArticleMap = new Map<string, boolean>();
    list.forEach(e => {
      viewedArticleMap.set(e.k, true);
    });
    return viewedArticleMap;
  }

  updateView() {
    this.pageService.updateViews(this.article_id).subscribe(
      data => {
        this.viewedList.push({ k: this.article_id });
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem("aid");
          localStorage.setItem("aid", JSON.stringify(this.viewedList));
        }
      }
    )
  }

  relatedArticles() {
    this.pageService.relatedArticles(this.cat_id, this.sub_cat_id, this.article_id).subscribe(
      data => {
        try {
          this.relatedArticlesList = JSON.parse(data.data);
        } catch {
        }
      }
    )
  }

  makeContent(data) {
    var htmlStr = "";
    data.forEach(item => {
      htmlStr = htmlStr + '<li *ngFor="let item of articeByCategory">' +
        '<div class="media wow fadeInDown animated" style="visibility: visible; animation-name: fadeInDown;">' +
        '<a class="media-left" href="/articles/' + item.category.name.toLowerCase() + '/' + item.sub_category.name.toLowerCase() + '/' + item.uid + '">' +
        '<img alt="" src="' + item.images.thumbnail + '"/> </a>' +
        '<div class="media-body">' +
        '<a class="catg_title" href="/articles/' + item.category.name.toLowerCase() + '/' + item.sub_category.name.toLowerCase() + '/' + item.uid + '"><h5>' + item.subject + '</h5></a>' +
        '<p>' + item.overview + '</p>' +
        '</div>' +
        '</div>' +
        '</li>';
    });
    return htmlStr;
  }
}
