import { Component, OnInit } from '@angular/core';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor(
    private meta: Meta,
    private title: Title) { }

  ngOnInit() {
    this.meta.updateTag({"robots":"noindex, nofollow"});
    this.title.setTitle("Behind Stories - 404");
  }

}
