import { Component, OnInit } from '@angular/core';
import { Constants, AlertService } from './../utils/index';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private meta: Meta,
    private title: Title) { 

  }

  ngOnInit() {
    this.meta.updateTag({"robots":"noindex, nofollow"});
    this.title.setTitle("Behind Stories - User");
  }

}
