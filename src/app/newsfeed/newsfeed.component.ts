import { Component, OnInit } from '@angular/core';
import { CategoriesService, PageService } from './../services';
import { Constants, AlertService } from './../utils/index';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
  catMap = new Map<string, number>();
  sliderCounter=0;
  sliderShow = 0;
  slider = new Array();

  newsFirst = null;
  newsRest = new Array();

  lifestyleFirst = null;
  lifestyleRest = new Array();

  technologyFirst = null;
  technologyRest = new Array();

  entertainmentFirst = null;
  entertainmentRest = new Array();

  sportsFirst = null;
  sportsRest = new Array();

  businessFirst = null;
  businessRest = new Array();

  humourFirst = null;
  humourRest = new Array();


  constructor(
    public categoriesService: CategoriesService,
    public pageService: PageService,
    public alertService: AlertService, 
    public meta: Meta,
    public title: Title
  ) { 
  }

  ngOnInit() {
    this.meta.addTag({name:"robots",content:Constants.META_DEFAULT.FOLLOW});
    this.meta.addTag({name:"description",content:Constants.META_DEFAULT.DESCRIPTION});
    this.meta.addTag({name:"keywords",content:"World News Technology Life & Style Business Entertainment Sports and Humour World"});
    this.meta.addTag({name:"image", content:Constants.META_DEFAULT.IMAGE});
    this.meta.addTag({itemprop:"name", content:Constants.META_DEFAULT.TITLE});
    this.meta.addTag({itemprop:"description", content:Constants.META_DEFAULT.DESCRIPTION});
    this.meta.addTag({itemprop:"image", content:Constants.META_DEFAULT.IMAGE});
    this.meta.addTag({name:"twitter:card", content:"summary"});
    this.meta.addTag({name:"twitter:title", content:Constants.META_DEFAULT.TITLE});
    this.meta.addTag({name:"twitter:description", content:Constants.META_DEFAULT.DESCRIPTION});
    this.meta.addTag({name:"twitter:site", content:Constants.META_DEFAULT.TWITTER_USER});
    this.meta.addTag({name:"twitter:creator", content:Constants.META_DEFAULT.TWITTER_USER});
    this.meta.addTag({name:"twitter:image:src", content:Constants.META_DEFAULT.IMAGE});
    this.meta.addTag({name:"og:title", content:Constants.META_DEFAULT.TITLE});
    this.meta.addTag({name:"og:description", content:Constants.META_DEFAULT.DESCRIPTION});
    this.meta.addTag({name:"og:image", content:Constants.META_DEFAULT.IMAGE});
    this.meta.addTag({name:"og:url", content:Constants.META_DEFAULT.SITE_URL});
    this.meta.addTag({name:"og:site_name", content:Constants.META_DEFAULT.SITE_NAME});
    this.meta.addTag({name:"fb:admins", content:Constants.META_DEFAULT.FB_ADMIN});
    this.meta.addTag({name:"fb:app_id", content:Constants.META_DEFAULT.FB_APP_ID});
    this.meta.addTag({name:"og:type", content:"website"});
    this.title.setTitle(Constants.META_DEFAULT.TITLE);

    this.categoriesService.getAll(0, 10).subscribe(
      data => {
        var categories = JSON.parse(data.data);
        categories.forEach(element => {
          var cat = element.name;
          if (!this.catMap.has(cat)) {
            this.catMap.set(cat, element.id);
          }
        });
        this.getFeeds();
      }
    );
  }

  getFeeds() {
    //News
    this.pageService.getPublishedArticleByCategory(this.catMap.get(Constants.CATEGORIES.NEWS), 0, 5).subscribe(
      data => {
        try {
          var o = JSON.parse(data.data);
          this.newsFirst = o[0];
          this.slider.push(o[0]);
          o.splice(0, 1);
          o.forEach(e => {
            this.newsRest.push(e);
            this.slider.push(e);
          });
        } catch {}
        finally{
          this.sliderCounter = this.sliderCounter + 1
          this.setSlider();
        }
      }
    );

    //Lifestyle
    this.pageService.getPublishedArticleByCategory(this.catMap.get(Constants.CATEGORIES.LIFESTYLE), 0, 5).subscribe(
      data => {
        try {
          var o = JSON.parse(data.data);
          this.lifestyleFirst = o[0];
          this.slider.push(o[0]);
          o.splice(0, 1);
          o.forEach(e => {
            this.lifestyleRest.push(e);
            this.slider.push(e);
          });
        } catch {}
        finally{
          this.sliderCounter = this.sliderCounter + 1
          this.setSlider();
        }
      }
    );


    //Technology
    this.pageService.getPublishedArticleByCategory(this.catMap.get(Constants.CATEGORIES.TECHNOLOGY), 0, 5).subscribe(
      data => {
        try {
          var o = JSON.parse(data.data);
          this.technologyFirst = o[0];
          this.slider.push(o[0]);
          o.splice(0, 1);
          o.forEach(e => {
            this.technologyRest.push(e);
            this.slider.push(e);
          });
        } catch {}
        finally{
          this.sliderCounter = this.sliderCounter + 1
          this.setSlider();
        }
      }
    );

    this.pageService.getPublishedArticleByCategory(this.catMap.get(Constants.CATEGORIES.ENTERTAINMENT), 0, 5).subscribe(
      data => {
        try {
          var o = JSON.parse(data.data);
          this.entertainmentFirst = o[0];
          this.slider.push(o[0]);
          o.splice(0, 1);
          o.forEach(e => {
            this.entertainmentRest.push(e);
            this.slider.push(e);
          });
        } catch {}
        finally{
          this.sliderCounter = this.sliderCounter + 1
          this.setSlider();
        }
      }
    );

    this.pageService.getPublishedArticleByCategory(this.catMap.get(Constants.CATEGORIES.SPORTS), 0, 5).subscribe(
      data => {
        try {
          var o = JSON.parse(data.data);
          this.sportsFirst = o[0];
          this.slider.push(o[0]);
          o.splice(0, 1);
          o.forEach(e => {
            this.sportsRest.push(e);
            this.slider.push(e);
          });
        } catch {}
        finally{
          this.sliderCounter = this.sliderCounter + 1
          this.setSlider();
        }
      }
    );

    this.pageService.getPublishedArticleByCategory(this.catMap.get(Constants.CATEGORIES.BUSINESS), 0, 5).subscribe(
      data => {
        try {
          var o = JSON.parse(data.data);
          this.businessFirst = o[0];
          this.slider.push(o[0]);
          o.splice(0, 1);
          o.forEach(e => {
            this.businessRest.push(e);
            this.slider.push(e);
          });
        } catch {}
        finally{
          this.sliderCounter = this.sliderCounter + 1
          this.setSlider();
        }
      }
    );

    this.pageService.getPublishedArticleByCategory(this.catMap.get(Constants.CATEGORIES.HUMOUR), 0, 5).subscribe(
      data => {
        try{
          var o = JSON.parse(data.data);
          this.humourFirst = o[0];
          this.slider.push(o[0]);
          o.splice(0, 1);
          o.forEach(e => {
            this.humourRest.push(e);
            this.slider.push(e);
          });
        }
        catch{}
        finally{
          this.sliderCounter = this.sliderCounter + 1
          this.setSlider();
        }
      }
    );
  }
  
  setSlider(){
    if(this.sliderCounter==7){
      this.sliderShow = this.slider.length;
    }
  }
}
