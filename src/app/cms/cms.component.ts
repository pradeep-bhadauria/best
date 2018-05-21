import { Component, OnInit } from '@angular/core';
import { CMSService, CategoriesService, SubCategoriesService, } from './../services/index';
import { Constants, AlertService } from './../utils/index';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {

  countriesList = null;
  statesList = null;
  citiesList = null;
  article_id = null;
  is_published = 0;
  body = "";
  keyword = "";
  image: FormData = null;

  displayImage = null;
  imageUrl = {
    upload: "",
    original: "",
    banner: "",
    thumbnail: ""
  };

  selectedCategory = null;
  selectedSubCategory = null;
  subject = "";
  overview = "";
  country = "";
  state = "";
  city = "";

  regionalFlag = false;
  loading = false;
  categoryList = new Array();
  subCategoryList = new Array();

  stats = {
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0
  }

  subject_err = "";
  overview_err = "";
  banner_err = "";
  keywords_err = "";
  body_err = "";

  constructor(
    private cmsService: CMSService,
    public alertService: AlertService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private title: Title,
    private meta: Meta) {
  }
  ngOnInit() {
    this.meta.updateTag({ "robots": "noindex, nofollow" });
    this.title.setTitle("Behind Stories - Editor");

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser == null) {
      document.location.href = "/login"
    } else if (currentUser.tid == Constants.ROLES.VIEWERS) {
      document.location.href = "/?redirect=RestrictedAccess"
    }
    else {
      this.route.params.subscribe(params => {
        if (params['id'] != undefined) {
          this.article_id = +params['id']; // (+) converts string 'id' to a number
        }
      });
      this.getCategoriesCount();
      this.getCountries();
      if (this.article_id != null) {
        this.cmsService.getArticleById(this.article_id).subscribe(
          data => {
            if (data.data != undefined) {
              let article = JSON.parse(data.data);
              this.is_published = article.is_published;
              if (currentUser.id != article.author.id && currentUser.tid != Constants.ROLES.ADMIN) {
                document.location.href = "/404"
              }
              else {
                this.subject = article.subject;
                try {
                  JSON.parse(article.keywords.replace(/\'/g, "\"")).forEach(element => {
                    this.keyword = this.keyword + " " + element.keyword
                  });
                } catch {
                  article.keywords.forEach(element => {
                    this.keyword = this.keyword + " " + element.keyword
                  });
                }
                this.keyword = this.keyword.trim();
                this.overview = article.overview;
                this.body = article.body;
                this.selectedCategory = article.category.id;
                this.selectedSubCategory = article.sub_category.id;
                this.imageUrl = article.images;
                this.displayImage = this.imageUrl.thumbnail;
                this.country = article.country;
                this.state = article.state;
                this.city = article.city;
                if (this.country.trim() != "") {
                  this.regionalFlag = true;
                }
              }
            } else {
              this.alertService.error(data.message);
            }
          },
          error => {
            try {
              this.alertService.error(JSON.parse(error._body).message);
            }
            catch {
              this.alertService.error("Server Error: Please try after some time.");
            }
          }
        );
      }
    }
  }

  getCountries() {
    this.cmsService.getCountries().subscribe(
      data => {
        if (data.data != undefined) {
          this.countriesList = JSON.parse(data.data);
          if (this.country.trim() != "" && this.regionalFlag) {
            this.countryChanged(0);
          }
        }
      }
    );
  }

  getCategories(c: number) {
    this.categoriesService.getAll(0, c).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          ul.forEach(e => {
            this.categoryList.push(e);
          });
        }
        if (this.selectedCategory == null) {
          this.selectedCategory = this.categoryList[0].id;
        }
        this.getSubCategories();
      }
    );
  }

  categoryChanged(cid) {
    this.selectedCategory = cid;
    this.selectedSubCategory = null;
    this.subCategoryList = new Array();
    this.getSubCategories();
  }

  getCategoriesCount() {
    this.categoriesService.count().subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.getCategories(ul.count);
        }
      }
    );
  }

  getSubCategories() {
    this.subCategoriesService.getByCategory(this.selectedCategory).subscribe(
      data => {
        if (data.data != undefined) {
          var ul = JSON.parse(data.data);
          this.subCategoryList = Array();
          ul.forEach(e => {
            this.subCategoryList.push(e);
          });
          if (this.selectedSubCategory == null) {
            this.selectedSubCategory = this.subCategoryList[0].id;
          }
        }
      }
    );
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name.toLowerCase());
      this.image = formData;
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.displayImage = e.target.result;
      }
      reader.readAsDataURL(file);

    }
  }

  saveBlog() {
    if (this.validate()) {
      document.getElementById("save").setAttribute("disabled", "disabled");
      if (this.image != null) {
        Constants.showLoader();
        if (this.article_id == null) {
          this.addArticle();
        } else {
          this.uploadImage(false);
        }
      } else if (this.article_id == null) {
        this.addArticle();
      } else {
        this.updateArticle(false);
      }
    } else {
      this.alertService.error("Please fix the errors are try again.");
    }
  }

  validate() {
    var isValid = true;
    if (this.subject.trim() == "" || (this.subject.length < 3 && this.subject.length > 100)) {
      this.subject_err = "Subject should be 10 - 100 characters long";
      isValid = false;
    } else {
      this.subject_err = "";
    }

    if (this.overview.trim() == "" || (this.overview.length < 3 && this.overview.length > 200)) {
      this.overview_err = "Overview should be 10 - 200 characters long";
      isValid = false;
    } else {
      this.overview_err = "";
    }
    var re = /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/
    if (this.keyword.trim() == "") {
      this.keywords_err = "Keywords are required!";
      isValid = false;
    } else if (this.keyword.split(" ").length > 5) {
      this.keywords_err = "Can use only 5 keywords.";
      isValid = false;
    } else if (!re.test(this.keyword)) {
      this.keywords_err = "Only characters and numbers can be used.";
      isValid = false;
    } else {
      this.keywords_err = "";
    }

    if (this.body.length < 10) {
      this.body_err = "Content needs to be atleast 10 characters long.";
      isValid = false;
    } else {
      this.body_err = ""
    }

    if (this.image == null && this.imageUrl.banner == "") {
      isValid = false;
      this.banner_err = "Display image is required!";
    } 
    if (this.image != null){
      if (this.image.get("file")["size"] > 2000001) {
        isValid = false;
        this.banner_err = "Max size supported is 2mb.";
      } else if (["image/png", "image/jpg", "image/jpeg"].indexOf(this.image.get("file")["type"].toLowerCase()) == -1) {
        isValid = false;
        this.banner_err = "Only png, jpg & jpeg formats supported.";
      } else {
        this.banner_err = "";
      }
    }
    return isValid;
  }

  uploadImage(flag: boolean) {
    this.cmsService.uploadImages(this.image, this.article_id).subscribe(
      data => {
        this.imageUrl.upload = data.images;
        this.imageUrl.original = data.images.secure_url;
        this.imageUrl.banner = data.images.eager[0].secure_url;
        this.imageUrl.thumbnail = data.images.eager[1].secure_url;
        this.updateArticle(flag);
      },
      error => {
        try {
          Constants.hideLoader();
          this.alertService.error(JSON.parse(error._body).message);
          document.getElementById("save").removeAttribute("disabled");
        }
        catch {
          Constants.hideLoader();
          this.alertService.error("Server Error: Please try after some time.");
          document.getElementById("save").removeAttribute("disabled");
        }
      }
    );
  }

  addArticle() {
    this.cmsService.add(this.selectedCategory, this.selectedSubCategory, this.subject, this.overview, this.keyword, this.imageUrl, this.country, this.state, this.body, this.city).subscribe(
      data => {
        if (data.data != undefined) {
          this.article_id = data.data.id;
          if (this.image != null) {
            this.uploadImage(true);
          } else {
            Constants.hideLoader();
            this.alertService.success("Success: Article created successfully");
            document.getElementById("save").removeAttribute("disabled");
          }

        }
      },
      error => {
        try {
          Constants.hideLoader();
          this.alertService.error(JSON.parse(error._body).message);
          document.getElementById("save").removeAttribute("disabled");
        }
        catch {
          Constants.hideLoader();
          this.alertService.error("Server Error: Please try after some time.");
          document.getElementById("save").removeAttribute("disabled");
        }
      }
    );
  }

  updateArticle(flag: boolean) {
    this.cmsService.update(this.article_id, this.selectedCategory, this.selectedSubCategory, this.subject, this.overview, this.keyword, this.imageUrl, this.country, this.state, this.body, this.city).subscribe(
      data => {
        if (flag) {
          Constants.hideLoader();
          this.alertService.success("Success: Article created successfully");
        } else {
          Constants.hideLoader();
          this.alertService.success("Success: Article updated successfully");
        }
        document.getElementById("save").removeAttribute("disabled");
      },
      error => {
        try {
          Constants.hideLoader();
          this.alertService.error(JSON.parse(error._body).message);
          document.getElementById("save").removeAttribute("disabled");
        }
        catch {
          Constants.hideLoader();
          this.alertService.error("Server Error: Please try after some time.");
          document.getElementById("save").removeAttribute("disabled");
        }
      }
    );
  }

  regionalCheck() {
    if (!this.regionalFlag) {
      this.country = "";
      this.state = "";
      this.city = "";
    }
  }

  countryChanged(flag: number) {
    if (flag == 1) {
      this.state = "";
      this.city = "";
    }
    this.citiesList = null;
    this.statesList = null;
    document.getElementById("state").setAttribute("disabled", "disabled");
    document.getElementById("city").setAttribute("disabled", "disabled")
    this.countriesList.forEach(e => {
      if (e.full_name == this.country.trim()) {
        this.statesList = e.states;
        document.getElementById("state").removeAttribute("disabled")
        if (this.state.trim() != "" && this.regionalFlag) {
          this.stateChanged()
        }
      }
    });
  }
  stateChanged() {
    var state_id = this.state.split("-")[0];
    this.countriesList.forEach(e => {
      if (e.full_name == this.country) {
        e.cities.forEach(e1 => {
          if (e1.state_id == state_id) {
            this.citiesList = e1.cities;
            document.getElementById("city").removeAttribute("disabled")
          }
        });
      }
    });
  }

  callPreview() {
    setTimeout(this.preview(), 3000);
  }
  preview() {
    this.cmsService.getArticleById(this.article_id).subscribe(
      data => {
        var article = JSON.parse(data.data);
        var uid = article.uid;
        var cat = article.category.name.trim().toLowerCase();
        var sub_cat = article.sub_category.name.trim().toLowerCase();
        document.location.href = "/articles/" + cat + "/" + sub_cat + "/" + uid
      },
      error => {
        this.alertService.error("Server Error: Error redirecting to preview. Please go to 'Profile > My Articles' for link.");
      }
    );
  }

  cancel() {
    if (confirm("Warning! Are you sure to cancel any changes made will be lost permanently.")) {
      document.location.href = "/";
    }
  }
  publish() {
    if (this.is_published == 0)
      this.is_published = 1;
    else
      this.is_published = 0;
    this.cmsService.publish(this.article_id, this.is_published).subscribe(
      data => {
        if (this.is_published == 1) {
          this.alertService.success("Success: Article published successfully.");
          this.callPreview();
        }
        else {
          this.alertService.success("Success: Article unpublished successfully.");
        }
      },
      error => {
        this.alertService.error("Sorry: We encountered some error. Please try after sometime.");
      }
    );

  }
}
