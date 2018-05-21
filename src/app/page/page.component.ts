import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Constants, AlertService } from './../utils/index';
import { PageService } from './../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PageComponent implements OnInit {
  infiniteScrollCount=0;
  offset=0;
  limit=Constants.DEFAULT.TABLE_PAGINATION_LIMIT;
  htmlVariable = "";
  displayFlag=0;
  url=null;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  category = null;
  cat_id = null;
  subcategory = null;
  sub_cat_id = null;
  article = null;
  articeByCategory = '';
  articeBySubCategory = '';
  article_id = null;
  uid=null;
  more="Load More";


  constructor(
    public alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private sanitizer: DomSanitizer,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['category'] != undefined) {
        this.category = params['category'];
        this.checkCategory(params);
      }
    });
  }

  checkCategory(params){
    this.pageService.getCategoryByName(this.category).subscribe(
      data => {
        if(data.data != undefined){
          var cat = JSON.parse(data.data);
          this.category = cat.name;
          this.cat_id = cat.id; 
          if (params['subcategory'] != undefined) {
            this.subcategory = params['subcategory'];
            this.checkSubCategory(params);
          } else {
            document.getElementById("comments").classList.add("hide");
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

  checkSubCategory(params){
    this.pageService.getSubCategoryByName(this.subcategory).subscribe(
      data => {
        if(data.data != undefined){
          var sub_cat = JSON.parse(data.data);
          this.sub_cat_id = sub_cat.id;
          this.subcategory = sub_cat.name;  
          if (params['article'] != undefined) {
            this.uid =  params['article'];
            this.getArticleByUid();
          } else {
            document.getElementById("comments").classList.add("hide");
            this.getArticlesBySubCategory();
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

  getArticlesByCategory(){
    this.pageService.getPublishedArticleByCategory(this.cat_id, this.offset, this.limit).subscribe(
      data => {
        try{
          this.title.setTitle("Behind Stories: " + this.category);
          var cat = JSON.parse(data.data);
          this.getCategoryCount();
          var html = this.makeContent(cat);
          //document.getElementById("articeBySubCategoryContainer").innerHTML += html;
          this.articeByCategory += html;
        } catch {
          this.articeByCategory = '';
        }
        this.displayFlag=1;
      }
    );
  }

  getArticlesBySubCategory(){
    this.pageService.getPublishedArticleBySubCategory(this.cat_id, this.sub_cat_id, this.offset, this.limit).subscribe(
      data => {
        try{
          var sub_cat = JSON.parse(data.data);
          this.title.setTitle("Behind Stories: " + this.category + " - " + this.subcategory);
          this.getSubCategoryCount();
          this.getCategoryCount();
          var html = this.makeContent(sub_cat);
          this.articeBySubCategory += html;
        } catch {
          this.articeBySubCategory = '';
        }
        this.displayFlag=2;
      }
    );
  }

  getArticleByUid(){
    this.url = document.location.href;
    this.pageService.getArticleByUid(this.uid).subscribe(
      data => {
        if(data.data != undefined){
          var temp = JSON.parse(data.data);
          if(this.currentUser == null && temp.is_published != Constants.DEFAULT.PUBLISHED){
            document.location.href = "/404";
          } else if (this.currentUser != null && 
            this.currentUser.id != temp.author.id && 
            temp.is_published != Constants.DEFAULT.PUBLISHED && 
            this.currentUser.tid != Constants.ROLES.ADMIN){
            document.location.href = "/404";
          } else {
            this.article = temp;
            this.article.body = this.sanitizer.bypassSecurityTrustHtml(this.article.body)
            this.title.setTitle(this.article.subject);
            console.log(this.article);
            var keyword="";
            this.article.keywords.forEach(element => {
              keyword = keyword + " " + element.keyword;
            });
            this.meta.updateTag({name:"description",content:this.article.overview});
            this.meta.updateTag({name: "keywords", content:keyword.trim()});
            this.displayFlag=3;
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

  getMore(){
    this.offset = this.offset + this.limit;
    if(this.offset < this.infiniteScrollCount ){
      if(this.displayFlag == 1){
        this.getArticlesByCategory();
      } else if (this.displayFlag == 2){
        this.getArticlesBySubCategory();
      }
    } else {
      document.getElementById("get-more").setAttribute("disabled","disabled");
      this.more="No More Articles Here";
    }
  }

  getCategoryCount(){
    this.pageService.getPublishedArticleByCategoryCount(this.cat_id).subscribe(
      data=>{
        this.infiniteScrollCount = JSON.parse(data.data).count;
      }
    )
  }

  getSubCategoryCount(){
    this.pageService.getPublishedArticleBySubCategoryCount(this.cat_id, this.sub_cat_id).subscribe(
      data=>{
        this.infiniteScrollCount = JSON.parse(data.data).count;
      }
    )
  }

  makeContent(data){
    var htmlStr="";
    data.forEach(item => {
      htmlStr = htmlStr + '<li *ngFor="let item of articeByCategory">'+
                            '<div class="media wow fadeInDown animated" style="visibility: visible; animation-name: fadeInDown;">'+
                                '<a class="media-left" href="/articles/'+ item.category.name.toLowerCase() +'/'+ item.sub_category.name.toLowerCase() +'/'+ item.uid+'">'+
                                '<img alt="" src="'+item.images.thumbnail+'"/> </a>'+
                                '<div class="media-body">'+
                                    '<h5><a class="catg_title" href="/articles/'+ item.category.name.toLowerCase() +'/'+ item.sub_category.name.toLowerCase() +'/'+ item.uid+'"> '+item.subject+'</a></h5>'+
                                  '<p>'+item.overview+'</p>'+
                                '</div>'+
                            '</div>'+
                        '</li>'; 
    });
    //return this.sanitizer.bypassSecurityTrustResourceUrl(htmlStr);
    return htmlStr;
  }
}
