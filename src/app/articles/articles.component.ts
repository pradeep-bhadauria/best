import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CategoriesService, PageService } from './../services';
import { Constants, AlertService } from './../utils/index';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  article_id = null;
  currentUser = null;
  article = null;
  uid = "";
  relatedArticlesList = null;
  viewedList = new Array();
  cat_id = null;
  sub_cat_id = null;
  url = "";
  keywords = "";
  subcategory = null;
  category = null;
  setIntervalTM = null;
  constructor(public categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    public pageService: PageService,
    public alertService: AlertService,
    public meta: Meta,
    public title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }
  ngOnInit() {
    this.meta.addTag({ name: "robots", content: Constants.META_DEFAULT.FOLLOW });
    this.meta.addTag({ name: "twitter:site", content: Constants.META_DEFAULT.TWITTER_USER });
    this.meta.addTag({ name: "twitter:creator", content: Constants.META_DEFAULT.TWITTER_USER });
    this.meta.addTag({ name: "og:site_name", content: Constants.META_DEFAULT.SITE_NAME });
    this.meta.addTag({ name: "fb:admins", content: Constants.META_DEFAULT.FB_ADMIN });
    this.meta.addTag({ name: "fb:app_id", content: Constants.META_DEFAULT.FB_APP_ID });
    this.meta.addTag({ name: "og:type", content: "website" });

    if (isPlatformBrowser(this.platformId)) {
      this.url = document.location.href;
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    }

    this.route.params.subscribe(params => {
      this.uid = params['article'];
      this.category = params['category'];
      this.subcategory = params['subcategory'];
    });

    this.pageService.getArticleByUid(this.uid).subscribe(
      data => {
        if (data.data != undefined) {
          var temp = JSON.parse(data.data);
          this.article_id = temp.id;
          if (this.currentUser == null && temp.is_published != Constants.DEFAULT.PUBLISHED) {
            if (isPlatformBrowser(this.platformId)) {
              document.location.href = "/404";
            }
          } else if (
            this.currentUser != null 
            && temp.is_published != Constants.DEFAULT.PUBLISHED 
            && this.currentUser.id != temp.author.id
          ) {
            if(this.currentUser.tid != Constants.ROLES.ADMIN){
              if (isPlatformBrowser(this.platformId)) {
                document.location.href = "/404";
              }
            }
          } else {
            this.article = temp;

            this.article.body = this.sanitizer.bypassSecurityTrustHtml(this.article.body)
            this.article.keywords.forEach(element => {
              this.keywords = this.keywords + " " + element.keyword;
            });
            this.title.setTitle(this.article.subject);
            this.meta.addTag({ name: "og:url", content: Constants.META_DEFAULT.SITE_URL +"/articles/"+this.category+"/"+this.subcategory+"/"+this.uid});
            this.meta.addTag({ name: "og:title", content: this.article.subject });
            this.meta.addTag({ name: "og:description", content: this.article.overview });
            this.meta.addTag({ name: "og:image", content: this.article.images.banner });
            this.meta.addTag({ name: "description", content: this.article.overview });
            this.meta.addTag({ name: "keywords", content: this.keywords.trim() });
            this.meta.addTag({ name: "image", content: this.article.images.banner });
            this.meta.addTag({ itemprop: "name", content: this.article.subject });
            this.meta.addTag({ itemprop: "description", content: this.article.overview });
            this.meta.addTag({ itemprop: "image", content: this.article.images.banner });
            this.meta.addTag({ name: "twitter:card", content: "summary" });
            this.meta.addTag({ name: "twitter:title", content: this.article.subject });
            this.meta.addTag({ name: "twitter:description", content: this.article.overview });
            this.meta.addTag({ name: "twitter:image:src", content: this.article.images.banner });
            this.meta.addTag({ name: "twitter:image", content: this.article.images.banner });
            
            this.pageService.getCategoryByName(this.category).subscribe(
              data => {
                if (data.data != undefined) {
                  var cat = JSON.parse(data.data);
                  this.cat_id = cat.id;
                  this.pageService.getSubCategoryByName(this.subcategory).subscribe(
                    data => {
                      if (data.data != undefined) {
                        var sub_cat = JSON.parse(data.data);
                        this.sub_cat_id = sub_cat.id;
                        this.relatedArticles();
                      } else {
                        if (isPlatformBrowser(this.platformId)) {
                          document.location.href = "/404";
                        }
                      }
                    },
                    error => {
                      this.alertService.error("Server Error: Please try after some time.");
                    }
                  );

                } else {
                  if (isPlatformBrowser(this.platformId)) {
                    document.location.href = "/404";
                  }
                }
              },
              error => {
                this.alertService.error("Server Error: Please try after some time.");
              }
            );
            if( temp.is_published == Constants.DEFAULT.PUBLISHED ){
              this.pageView();
            }
          }
        } else {
          if (isPlatformBrowser(this.platformId)) {
            document.location.href = "/404"
          }
        }
      }
    );
  }

  makeMap(list) {
    var viewedArticleMap = new Map<string, boolean>();
    list.forEach(e => {
      viewedArticleMap.set(e.k, true);
    });
    return viewedArticleMap;
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
        localStorage.setItem("aid", JSON.stringify(this.viewedList));
        this.updateView();
      }
    }
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

  parseString(str: string){
    return str.replace(/\-/g," ");
  }

}
