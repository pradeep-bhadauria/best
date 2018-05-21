import { Component, OnInit } from '@angular/core';
import { Constants, AlertService } from './../utils/index';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {

  constructor(private meta: Meta,
    private title: Title) { }

  ngOnInit() {
    this.meta.updateTag({ "robots": "noindex, nofollow" });
    this.title.setTitle("Behind Stories - Contact Us");
    
  }

}
