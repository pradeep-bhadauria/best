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
        if(this.infiniteScrollCount == 0){
          if(isPlatformBrowser(this.platformId)){
            document.getElementById("search-err").classList.remove("hide");
            document.getElementById("search-err").classList.add("show");
          }
        } else {
          this.searchPublishedArticles();
        }
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
            this.getArticlesByCategory();
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
          this.getArticlesBySubCategory();
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
