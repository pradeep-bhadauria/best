import { Component,ChangeDetectionStrategy, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, PLATFORM_ID, Inject } from '@angular/core';
import { NewsfeedComponent } from './newsfeed/newsfeed.component'
import { SubCategoriesService, PageService } from './services';
import { Constants, AlertService } from './utils/index';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isBrowser=false;
  showMenu = false;
  admin = false;
  author = false;
  currentUser = null;
  menuMap = new Map<string, string[]>();
  catMap = new Map<string, number>();
  latestNews = null;
  popularArticleList = null;
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private subCategoryService: SubCategoriesService,
    private pageService: PageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }
  ngOnInit() {
    this.getPopularArticles();
    
    if (this.currentUser == null) {
      this.showMenu = false;
    } else {
      if (this.currentUser.tid == Constants.ROLES.ADMIN) {
        this.admin = true;
      } else if (this.currentUser.tid == Constants.ROLES.AUTHORS) {
        this.author = true;
      }
      this.showMenu = true;
    }
    this.route.queryParams.subscribe(params => {
      var redirect = params['redirect'];
      if (redirect == "RestrictedAccess") {
        this.alertService.error("Restricted Access: You dont have sufficient permission to access request URL.");
      }
    });
    this.getSubCategories();
  }

  getSubCategories() {
    this.subCategoryService.count().subscribe(
      data => {
        this.subCategoryService.getAll(0, JSON.parse(data.data).count).subscribe(
          data => {
            var sub = JSON.parse(data.data);
            sub.forEach(element => {
              var cat = element.category.name;
              if (!this.catMap.has(cat)) {
                this.catMap.set(cat, element.category.id);
              }
              if (this.menuMap.has(cat)) {
                this.menuMap.get(cat).push(element.name);
              } else {
                this.menuMap.set(cat, [element.name]);
              }
            });
            this.getLatestNews();
          }
        );
      }
    );
  }

  getLatestNews() {
    var cat_id = this.catMap.get(Constants.CATEGORIES.NEWS);
    this.pageService.getPublishedArticleByCategory(cat_id, 0, 10).subscribe(
      data => {
        this.latestNews = JSON.parse(data.data);
      }
    );
  }

  getPopularArticles() {
    this.pageService.popularArticles().subscribe(
      data => {
        this.popularArticleList = JSON.parse(data.data);
      }
    );

  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      document.location.href = "/";
    }
  }
}
