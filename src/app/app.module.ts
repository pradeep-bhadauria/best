import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {TransferHttpCacheModule} from '@nguniversal/common';
import { DisqusModule } from 'angular2-disqus';

//Services
import { NgDatepickerModule } from 'ng2-datepicker';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MomentModule } from 'angular2-moment';
import {FacebookModule} from 'ngx-facebook';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserlevelComponent } from './userlevel/userlevel.component';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { UserComponent } from './user/user.component';
import { CategoryComponent } from './category/category.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PageComponent } from './page/page.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ComfirmemailComponent } from './comfirmemail/comfirmemail.component';
import { ArticlesComponent } from './articles/articles.component';

import { AlertComponent, AlertService, SeoService } from './utils/index';
import { UserlevelService, UserService, CategoriesService, SubCategoriesService, CMSService, ProfileService, PageService } from './services/index';
import { CmsComponent } from './cms/cms.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: NewsfeedComponent },
  { path: 'user-level', component: UserlevelComponent },
  { path: 'users', component: UserComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'subcategory', component: SubcategoryComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'articles/search', component: PageComponent },
  { path: 'articles/:category', component: PageComponent },
  { path: 'articles/:category/:subcategory', component: PageComponent },
  { path: 'articles/:category/:subcategory/:article', component: ArticlesComponent },
  { path: '404', component: NotfoundComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'confirm-email', component: ComfirmemailComponent },
  { path: 'editor', component: CmsComponent },
  { path: 'editor/:id', component: CmsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:module', component: ProfileComponent },
  { path: '**', redirectTo: '404' }
];


@NgModule({
  declarations: [
    AppComponent,
    UserlevelComponent,
    AlertComponent,
    NewsfeedComponent,
    UserComponent,
    CategoryComponent,
    SubcategoryComponent,
    ContactusComponent,
    PageComponent,
    NotfoundComponent,
    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ComfirmemailComponent,
    CmsComponent,
    ProfileComponent,
    ArticlesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'behind-stories'}),
    NgDatepickerModule,
    HttpClientModule,HttpModule,
    RouterModule.forRoot(routes, {useHash: false}),
    FormsModule,
    AppRoutingModule,
    EditorModule,
    MomentModule,
    DisqusModule,
    TransferHttpCacheModule,
  ],
  providers: [
    UserlevelService,UserService, CategoriesService, SubCategoriesService, CMSService,ProfileService,PageService,
    AlertService, SeoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    //console.log(`Running ${platform} with appId=${appId}`);
  }
}
